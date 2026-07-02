import { EventEmitter } from "node:events";
import { Zalo } from "zca-js";
import { decryptJson } from "./crypto.js";
import { all, get, nowIso, run } from "./db.js";

const MAX_RECONNECT_ATTEMPTS = 6;
const RECONNECT_BASE_MS = 4_000;
const LISTENER_LOG_PREFIX = "[zalo-listener]";

const messageEvents = new EventEmitter();
messageEvents.setMaxListeners(50);

const activeListeners = new Map();

function log(...args) {
  console.log(LISTENER_LOG_PREFIX, ...args);
}

function parseMessageContent(message) {
  if (message == null) return "";
  if (typeof message === "string") return message;
  if (typeof message === "object") {
    if (typeof message.text === "string") return message.text;
    if (typeof message.title === "string") return message.title;
    if (typeof message.description === "string") return message.description;
    if (typeof message.href === "string") return message.href;
    if (typeof message.content === "string") return message.content;
    if (Array.isArray(message.content)) return message.content.join("\n");
    try {
      return JSON.stringify(message);
    } catch {
      return "";
    }
  }
  return String(message);
}

function buildMessagePreview(content) {
  const text = (content || "").toString().replace(/\s+/g, " ").trim();
  if (!text) return "[Tin nhắn]";
  return text.length > 80 ? `${text.slice(0, 80)}…` : text;
}

function ensureConversation({ accountId, threadId, threadType, displayName, avatar, memberCount }) {
  const conversationId = `${accountId}:${threadId}`;
  const existing = get(
    "SELECT id FROM zalo_conversations WHERE account_id = ? AND thread_id = ?",
    [accountId, threadId]
  );
  const ts = nowIso();
  if (existing) {
    run(
      `UPDATE zalo_conversations
       SET name = COALESCE(NULLIF(:name, ''), name),
           avatar = COALESCE(NULLIF(:avatar, ''), avatar),
           thread_type = :thread_type,
           member_count = COALESCE(:member_count, member_count),
           updated_at = :updated_at
       WHERE id = :id`,
      {
        id: conversationId,
        name: displayName || "",
        avatar: avatar || "",
        thread_type: threadType,
        member_count: memberCount ?? null,
        updated_at: ts
      }
    );
    return conversationId;
  }

  run(
    `INSERT INTO zalo_conversations (
      id, account_id, thread_id, thread_type, name, avatar,
      last_message_preview, last_message_at, unread_count, member_count,
      created_at, updated_at
    ) VALUES (
      :id, :account_id, :thread_id, :thread_type, :name, :avatar,
      '', NULL, 0, :member_count, :created_at, :updated_at
    )`,
    {
      id: conversationId,
      account_id: accountId,
      thread_id: threadId,
      thread_type: threadType,
      name: displayName || threadId,
      avatar: avatar || null,
      member_count: memberCount ?? null,
      created_at: ts,
      updated_at: ts
    }
  );
  return conversationId;
}

function upsertConversationMeta(meta) {
  return ensureConversation(meta);
}

function markConversationUpdate({ conversationId, preview, ts }) {
  run(
    `UPDATE zalo_conversations
     SET last_message_preview = :preview,
         last_message_at = :ts,
         unread_count = unread_count + 1,
         updated_at = :updated_at
     WHERE id = :id`,
    {
      id: conversationId,
      preview: preview || "",
      ts: ts || nowIso(),
      updated_at: nowIso()
    }
  );
}

function persistIncomingMessage({ accountId, message }) {
  const threadId = message.threadId;
  const threadType = message.type === 1 ? "group" : "user";
  const data = message.data || {};
  const senderId = String(data.uidFrom || "");
  const senderName = data.dName || senderId || "Người gửi";
  const content = parseMessageContent(data.content);
  const ts = data.ts ? new Date(Number(data.ts)).toISOString() : nowIso();
  const cliMsgId = data.cliMsgId || `${accountId}:${data.msgId || Date.now()}`;
  const messageId = `msg-${accountId}-${cliMsgId}`;
  const conversationId = ensureConversation({
    accountId,
    threadId,
    threadType,
    displayName: threadType === "group" ? `Nhóm ${threadId.slice(-6)}` : senderName,
    avatar: null,
    memberCount: threadType === "group" ? null : null
  });

  const existing = get("SELECT id FROM zalo_messages WHERE id = ?", [messageId]);
  if (existing) {
    return { duplicate: true };
  }

  run(
    `INSERT INTO zalo_messages (
      id, account_id, conversation_id, cli_msg_id, msg_id, thread_id, thread_type,
      sender_id, sender_name, is_self, msg_type, content, quote, mentions, attachments,
      status, delivered_at, ts, created_at
    ) VALUES (
      :id, :account_id, :conversation_id, :cli_msg_id, :msg_id, :thread_id, :thread_type,
      :sender_id, :sender_name, :is_self, :msg_type, :content, :quote, :mentions, :attachments,
      :status, :delivered_at, :ts, :created_at
    )`,
    {
      id: messageId,
      account_id: accountId,
      conversation_id: conversationId,
      cli_msg_id: cliMsgId,
      msg_id: data.msgId || null,
      thread_id: threadId,
      thread_type: threadType,
      sender_id: senderId,
      sender_name: senderName,
      is_self: message.isSelf ? 1 : 0,
      msg_type: data.msgType || null,
      content,
      quote: data.quote ? JSON.stringify(data.quote) : null,
      mentions: Array.isArray(data.mentions) ? JSON.stringify(data.mentions) : null,
      attachments: null,
      status: typeof data.status === "number" ? data.status : null,
      delivered_at: null,
      ts,
      created_at: nowIso()
    }
  );

  markConversationUpdate({
    conversationId,
    preview: buildMessagePreview(`${message.isSelf ? "Bạn" : senderName}: ${content}`),
    ts
  });

  return {
    duplicate: false,
    messageId,
    conversationId,
    accountId,
    threadId,
    threadType,
    senderId,
    senderName,
    content,
    isSelf: !!message.isSelf,
    ts
  };
}

function setListenerState(accountId, fields) {
  const ts = nowIso();
  const existing = get("SELECT account_id FROM zalo_listeners WHERE account_id = ?", [accountId]);
  if (existing) {
    run(
      `UPDATE zalo_listeners
       SET status = COALESCE(:status, status),
           last_connected_at = COALESCE(:last_connected_at, last_connected_at),
           last_disconnected_at = COALESCE(:last_disconnected_at, last_disconnected_at),
           last_error = :last_error,
           reconnect_attempts = :reconnect_attempts,
           updated_at = :updated_at
       WHERE account_id = :account_id`,
      {
        account_id: accountId,
        status: fields.status ?? null,
        last_connected_at: fields.lastConnectedAt ?? null,
        last_disconnected_at: fields.lastDisconnectedAt ?? null,
        last_error: fields.lastError ?? null,
        reconnect_attempts: fields.reconnectAttempts ?? 0,
        updated_at: ts
      }
    );
    return;
  }

  run(
    `INSERT INTO zalo_listeners (
      account_id, status, last_connected_at, last_disconnected_at, last_error,
      reconnect_attempts, updated_at
    ) VALUES (
      :account_id, :status, :last_connected_at, :last_disconnected_at, :last_error,
      :reconnect_attempts, :updated_at
    )`,
    {
      account_id: accountId,
      status: fields.status || "initializing",
      last_connected_at: fields.lastConnectedAt || null,
      last_disconnected_at: fields.lastDisconnectedAt || null,
      last_error: fields.lastError || null,
      reconnect_attempts: fields.reconnectAttempts ?? 0,
      updated_at: ts
    }
  );
}

function getListenerState(accountId) {
  return get("SELECT * FROM zalo_listeners WHERE account_id = ?", [accountId]);
}

function listListeners() {
  return all(
    `SELECT l.account_id, l.status, l.last_connected_at, l.last_disconnected_at,
            l.last_error, l.reconnect_attempts, l.updated_at,
            a.display_name, a.avatar
     FROM zalo_listeners l
     LEFT JOIN zalo_accounts a ON a.id = l.account_id
     ORDER BY a.updated_at DESC`
  ).map((row) => ({
    accountId: row.account_id,
    status: row.status,
    lastConnectedAt: row.last_connected_at,
    lastDisconnectedAt: row.last_disconnected_at,
    lastError: row.last_error,
    reconnectAttempts: row.reconnect_attempts,
    updatedAt: row.updated_at,
    displayName: row.display_name,
    avatar: row.avatar
  }));
}

function decodeAccount(account) {
  if (!account?.encrypted_credentials) {
    throw new Error(`Tài khoản ${account.id} chưa có credentials đã mã hóa.`);
  }
  return decryptJson(account.encrypted_credentials);
}

async function bootListener(accountId) {
  if (activeListeners.has(accountId)) {
    return activeListeners.get(accountId);
  }

  const account = get("SELECT * FROM zalo_accounts WHERE id = ?", [accountId]);
  if (!account) {
    throw new Error(`Không tìm thấy tài khoản ${accountId}.`);
  }

  const credentials = decodeAccount(account);
  const zalo = new Zalo({ logging: false });
  const api = await zalo.login({
    cookie: credentials.cookie,
    imei: credentials.imei,
    userAgent: credentials.userAgent,
    language: credentials.language || "vi"
  });

  const listenerContext = {
    accountId,
    api,
    status: "connecting",
    reconnectAttempts: getListenerState(accountId)?.reconnect_attempts ?? 0,
    retryHandle: null,
    reconnectTimer: null
  };

  api.listener.on("connected", () => {
    listenerContext.status = "connected";
    listenerContext.reconnectAttempts = 0;
    setListenerState(accountId, {
      status: "connected",
      lastConnectedAt: nowIso(),
      lastError: null,
      reconnectAttempts: 0
    });
    log(account.display_name || accountId, "listener connected");
  });

  api.listener.on("closed", (code, reason) => {
    listenerContext.status = "disconnected";
    setListenerState(accountId, {
      status: "disconnected",
      lastDisconnectedAt: nowIso(),
      lastError: reason ? `${code} ${reason}` : `Mất kết nối (${code})`
    });
    log(account.display_name || accountId, "listener closed", code, reason);
    scheduleReconnect(listenerContext, account);
  });

  api.listener.on("error", (error) => {
    setListenerState(accountId, {
      status: "error",
      lastError: error?.message || String(error)
    });
    log(account.display_name || accountId, "listener error", error?.message || error);
  });

  api.listener.on("message", (message) => {
    handleIncomingMessage(accountId, message).catch((error) => {
      log("persist error", error?.message || error);
    });
  });

  api.listener.on("old_messages", (messages) => {
    if (!Array.isArray(messages)) return;
    for (const message of messages) {
      handleIncomingMessage(accountId, message).catch((error) => {
        log("persist old message error", error?.message || error);
      });
    }
  });

  api.listener.on("reaction", (reaction) => {
    log("reaction", account.display_name || accountId, reaction?.data?.msgId || reaction?.msgId);
  });

  api.listener.on("typing", (typing) => {
    log("typing", account.display_name || accountId, typing?.threadId);
  });

  api.listener.start({ retryOnClose: true });

  setListenerState(accountId, {
    status: "starting",
    reconnectAttempts: listenerContext.reconnectAttempts
  });

  activeListeners.set(accountId, listenerContext);
  return listenerContext;
}

function scheduleReconnect(context, account) {
  if (context.reconnectTimer) return;
  if (context.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    log(account.display_name || context.accountId, "đã đạt giới hạn reconnect, dừng thử lại.");
    setListenerState(context.accountId, {
      status: "stopped",
      lastError: "Đã đạt giới hạn reconnect, cần đăng nhập lại QR."
    });
    activeListeners.delete(context.accountId);
    return;
  }

  const delay = RECONNECT_BASE_MS * Math.pow(2, context.reconnectAttempts);
  context.reconnectAttempts += 1;
  setListenerState(context.accountId, {
    status: "reconnecting",
    reconnectAttempts: context.reconnectAttempts,
    lastError: `Đang thử lại sau ${Math.round(delay / 1000)}s`
  });
  context.reconnectTimer = setTimeout(async () => {
    context.reconnectTimer = null;
    try {
      if (activeListeners.has(context.accountId)) {
        activeListeners.delete(context.accountId);
      }
      await bootListener(context.accountId);
    } catch (error) {
      log("reconnect error", context.accountId, error?.message || error);
      scheduleReconnect(context, account);
    }
  }, delay);
}

async function handleIncomingMessage(accountId, message) {
  try {
    const result = persistIncomingMessage({ accountId, message });
    if (result.duplicate) return;
    messageEvents.emit("message", result);
  } catch (error) {
    log("handleIncomingMessage error", error?.message || error);
  }
}

export const __testHooks = { handleIncomingMessage, persistIncomingMessage };

export async function startListenerForAccount(accountId) {
  return bootListener(accountId);
}

export async function startListenersForAllAccounts() {
  const accounts = all(
    `SELECT id, display_name FROM zalo_accounts WHERE status = 'online'`
  );
  const results = [];
  for (const account of accounts) {
    try {
      await bootListener(account.id);
      results.push({ accountId: account.id, ok: true, displayName: account.display_name });
    } catch (error) {
      setListenerState(account.id, {
        status: "error",
        lastError: error?.message || String(error)
      });
      results.push({
        accountId: account.id,
        ok: false,
        displayName: account.display_name,
        error: error?.message || String(error)
      });
      log("failed to start listener for", account.display_name || account.id, error?.message || error);
    }
  }
  return results;
}

export function stopListenerForAccount(accountId) {
  const context = activeListeners.get(accountId);
  if (!context) return false;
  if (context.reconnectTimer) {
    clearTimeout(context.reconnectTimer);
    context.reconnectTimer = null;
  }
  try {
    context.api.listener.stop();
  } catch (error) {
    log("stop error", accountId, error?.message || error);
  }
  activeListeners.delete(accountId);
  setListenerState(accountId, {
    status: "stopped",
    lastError: "Đã dừng listener theo yêu cầu."
  });
  return true;
}

export function getActiveListenerAccountIds() {
  return Array.from(activeListeners.keys());
}

export function onMessage(handler) {
  messageEvents.on("message", handler);
  return () => messageEvents.off("message", handler);
}

export function listConversations({ accountId, search, limit } = {}) {
  const params = [];
  let where = "1=1";
  if (accountId) {
    where += " AND c.account_id = ?";
    params.push(accountId);
  }
  if (search && search.trim()) {
    where += " AND (c.name LIKE ? OR c.last_message_preview LIKE ?)";
    const like = `%${search.trim()}%`;
    params.push(like, like);
  }

  const take = Math.max(1, Math.min(Number(limit) || 200, 500));
  return all(
    `SELECT c.id, c.account_id, c.thread_id, c.thread_type, c.name, c.avatar,
            c.last_message_preview, c.last_message_at, c.unread_count, c.member_count,
            c.updated_at, a.display_name AS account_display_name, a.avatar AS account_avatar
     FROM zalo_conversations c
     LEFT JOIN zalo_accounts a ON a.id = c.account_id
     WHERE ${where}
     ORDER BY COALESCE(c.last_message_at, c.updated_at) DESC
     LIMIT ${take}`,
    params
  ).map((row) => ({
    id: row.id,
    accountId: row.account_id,
    accountDisplayName: row.account_display_name,
    accountAvatar: row.account_avatar,
    threadId: row.thread_id,
    threadType: row.thread_type,
    name: row.name,
    avatar: row.avatar,
    lastMessagePreview: row.last_message_preview,
    lastMessageAt: row.last_message_at,
    unreadCount: row.unread_count,
    memberCount: row.member_count,
    updatedAt: row.updated_at
  }));
}

export function getConversation(conversationId) {
  return get(
    `SELECT c.*, a.display_name AS account_display_name, a.avatar AS account_avatar
     FROM zalo_conversations c
     LEFT JOIN zalo_accounts a ON a.id = c.account_id
     WHERE c.id = ?`,
    [conversationId]
  );
}

export function listMessages({ conversationId, limit } = {}) {
  if (!conversationId) return [];
  const take = Math.max(1, Math.min(Number(limit) || 200, 1000));
  return all(
    `SELECT id, account_id, conversation_id, cli_msg_id, msg_id, thread_id, thread_type,
            sender_id, sender_name, is_self, msg_type, content, quote, mentions,
            status, ts, created_at
     FROM zalo_messages
     WHERE conversation_id = ?
     ORDER BY ts ASC
     LIMIT ${take}`,
    [conversationId]
  ).map((row) => ({
    id: row.id,
    accountId: row.account_id,
    conversationId: row.conversation_id,
    cliMsgId: row.cli_msg_id,
    msgId: row.msg_id,
    threadId: row.thread_id,
    threadType: row.thread_type,
    senderId: row.sender_id,
    senderName: row.sender_name,
    isSelf: row.is_self === 1,
    msgType: row.msg_type,
    content: row.content,
    quote: row.quote ? safeJson(row.quote) : null,
    mentions: row.mentions ? safeJson(row.mentions) : null,
    status: row.status,
    ts: row.ts,
    createdAt: row.created_at
  }));
}

export function resetUnread(conversationId) {
  run(
    `UPDATE zalo_conversations SET unread_count = 0, updated_at = ? WHERE id = ?`,
    [nowIso(), conversationId]
  );
}

export function getListenerSummary() {
  const listenerRows = listListeners();
  const accountRows = all(
    `SELECT id, display_name, avatar, status, last_sync_at
     FROM zalo_accounts
     ORDER BY updated_at DESC`
  ).map((row) => ({
    accountId: row.id,
    displayName: row.display_name,
    avatar: row.avatar,
    status: row.status,
    lastSyncAt: row.last_sync_at,
    listener: listenerRows.find((item) => item.accountId === row.id) || null
  }));
  return accountRows;
}

export async function refreshConversationsForAccount(accountId) {
  const context = activeListeners.get(accountId);
  if (!context) return { requested: false };
  try {
    context.api.listener.requestOldMessages?.(0);
    context.api.listener.requestOldMessages?.(1);
    return { requested: true };
  } catch (error) {
    log("refresh error", accountId, error?.message || error);
    return { requested: false, error: error?.message || String(error) };
  }
}

function safeJson(value) {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}