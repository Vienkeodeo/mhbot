import { randomUUID } from "node:crypto";
import { LoginQRCallbackEventType, Zalo } from "zca-js";
import { encryptJson } from "./crypto.js";
import { all, get, nowIso, run } from "./db.js";
import { startListenerForAccount } from "./zaloListenerService.js";

const activeSessions = new Map();

const DEFAULT_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0";

const terminalStatuses = new Set(["linked", "expired", "declined", "aborted", "error"]);

function publicSession(row) {
  if (!row) return null;
  return {
    id: row.id,
    displayName: row.display_name,
    status: row.status,
    qrCode: row.qr_code,
    qrImage: row.qr_image,
    scannedUser: row.scanned_display_name
      ? {
          displayName: row.scanned_display_name,
          avatar: row.scanned_avatar
        }
      : null,
    linkedAccount: row.linked_display_name
      ? {
          displayName: row.linked_display_name,
          avatar: row.linked_avatar
        }
      : null,
    errorMessage: row.error_message,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    expiresAt: row.expires_at,
    completedAt: row.completed_at,
    isTerminal: terminalStatuses.has(row.status)
  };
}

function updateSession(id, fields) {
  const current = get("SELECT * FROM zalo_qr_sessions WHERE id = ?", [id]);
  if (!current) return null;

  const merged = {
    display_name: current.display_name,
    status: current.status,
    qr_code: current.qr_code,
    qr_image: current.qr_image,
    scanned_display_name: current.scanned_display_name,
    scanned_avatar: current.scanned_avatar,
    linked_display_name: current.linked_display_name,
    linked_avatar: current.linked_avatar,
    encrypted_credentials: current.encrypted_credentials,
    error_message: current.error_message,
    expires_at: current.expires_at,
    completed_at: current.completed_at,
    ...fields,
    updated_at: nowIso()
  };

  run(
    `UPDATE zalo_qr_sessions
     SET display_name = :display_name,
         status = :status,
         qr_code = :qr_code,
         qr_image = :qr_image,
         scanned_display_name = :scanned_display_name,
         scanned_avatar = :scanned_avatar,
         linked_display_name = :linked_display_name,
         linked_avatar = :linked_avatar,
         encrypted_credentials = :encrypted_credentials,
         error_message = :error_message,
         expires_at = :expires_at,
         completed_at = :completed_at,
         updated_at = :updated_at
     WHERE id = :id`,
    { ...merged, id }
  );

  return getSession(id);
}

function upsertAccount({ sessionId, displayName, avatar, encryptedCredentials }) {
  const existing = get("SELECT id FROM zalo_accounts WHERE session_id = ?", [sessionId]);
  const timestamp = nowIso();

  if (existing) {
    run(
      `UPDATE zalo_accounts
       SET display_name = :display_name,
           avatar = :avatar,
           status = 'online',
           encrypted_credentials = :encrypted_credentials,
           updated_at = :updated_at,
           last_sync_at = :last_sync_at
       WHERE session_id = :session_id`,
      {
        session_id: sessionId,
        display_name: displayName,
        avatar,
        encrypted_credentials: encryptedCredentials,
        updated_at: timestamp,
        last_sync_at: timestamp
      }
    );
    return existing.id;
  }

  const newId = randomUUID();
  run(
    `INSERT INTO zalo_accounts (
      id, session_id, display_name, avatar, status, encrypted_credentials, created_at, updated_at, last_sync_at
     ) VALUES (
      :id, :session_id, :display_name, :avatar, 'online', :encrypted_credentials, :created_at, :updated_at, :last_sync_at
     )`,
    {
      id: newId,
      session_id: sessionId,
      display_name: displayName,
      avatar,
      encrypted_credentials: encryptedCredentials,
      created_at: timestamp,
      updated_at: timestamp,
      last_sync_at: timestamp
    }
  );
  return newId;
}

function handleQrEvent(id, event) {
  const active = activeSessions.get(id);
  if (active && event.actions) active.actions = event.actions;

  if (event.type === LoginQRCallbackEventType.QRCodeGenerated) {
    updateSession(id, {
      status: "qr_ready",
      qr_code: event.data.code,
      qr_image: `data:image/png;base64,${event.data.image}`,
      error_message: null,
      expires_at: new Date(Date.now() + 100_000).toISOString()
    });
    return;
  }

  if (event.type === LoginQRCallbackEventType.QRCodeExpired) {
    updateSession(id, {
      status: "expired",
      completed_at: nowIso(),
      error_message: "QR đã hết hạn. Hãy tạo phiên QR mới."
    });
    activeSessions.delete(id);
    return;
  }

  if (event.type === LoginQRCallbackEventType.QRCodeScanned) {
    updateSession(id, {
      status: "scanned",
      scanned_display_name: event.data.display_name,
      scanned_avatar: event.data.avatar,
      error_message: null
    });
    return;
  }

  if (event.type === LoginQRCallbackEventType.QRCodeDeclined) {
    updateSession(id, {
      status: "declined",
      completed_at: nowIso(),
      error_message: "Người dùng đã từ chối xác nhận đăng nhập trên điện thoại."
    });
    activeSessions.delete(id);
    return;
  }

  if (event.type === LoginQRCallbackEventType.GotLoginInfo) {
    const encryptedCredentials = encryptJson({
      cookie: event.data.cookie,
      imei: event.data.imei,
      userAgent: event.data.userAgent,
      savedAt: nowIso()
    });
    const session = get("SELECT * FROM zalo_qr_sessions WHERE id = ?", [id]);
    const displayName = session?.scanned_display_name || session?.display_name || "Zalo cá nhân";
    const avatar = session?.scanned_avatar || null;

    updateSession(id, {
      status: "linked",
      linked_display_name: displayName,
      linked_avatar: avatar,
      encrypted_credentials: encryptedCredentials,
      completed_at: nowIso(),
      error_message: null
    });

    const accountId = upsertAccount({ sessionId: id, displayName, avatar, encryptedCredentials });
    activeSessions.delete(id);

    startListenerForAccount(accountId).catch((error) => {
      console.log("[zalo-qr] auto-start listener error", accountId, error?.message || error);
    });
  }
}

export function createQrSession({ displayName }) {
  const id = randomUUID();
  const timestamp = nowIso();
  const safeDisplayName = displayName?.trim() || "Tài khoản Zalo cá nhân";

  run(
    `INSERT INTO zalo_qr_sessions (
      id, display_name, status, created_at, updated_at
     ) VALUES (
      :id, :display_name, 'initializing', :created_at, :updated_at
     )`,
    {
      id,
      display_name: safeDisplayName,
      created_at: timestamp,
      updated_at: timestamp
    }
  );

  const zalo = new Zalo({ logging: false });
  const active = { actions: null };
  activeSessions.set(id, active);

  zalo
    .loginQR(
      {
        userAgent: DEFAULT_USER_AGENT,
        language: "vi"
      },
      (event) => handleQrEvent(id, event)
    )
    .catch((error) => {
      if (getSession(id)?.isTerminal) return;
      updateSession(id, {
        status: error?.name === "ZaloApiLoginQRAborted" ? "aborted" : "error",
        completed_at: nowIso(),
        error_message: error?.message || "Không thể hoàn tất QR login Zalo."
      });
      activeSessions.delete(id);
    });

  return getSession(id);
}

export function getSession(id) {
  return publicSession(get("SELECT * FROM zalo_qr_sessions WHERE id = ?", [id]));
}

export function abortSession(id) {
  const active = activeSessions.get(id);
  if (active?.actions?.abort) {
    active.actions.abort();
  }
  updateSession(id, {
    status: "aborted",
    completed_at: nowIso(),
    error_message: "Phiên QR đã được hủy."
  });
  activeSessions.delete(id);
  return getSession(id);
}

export function listAccounts() {
  return all(
    `SELECT id, session_id, display_name, avatar, status, created_at, updated_at, last_sync_at
     FROM zalo_accounts
     ORDER BY updated_at DESC`
  ).map((row) => ({
    id: row.id,
    sessionId: row.session_id,
    displayName: row.display_name,
    avatar: row.avatar,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastSyncAt: row.last_sync_at
  }));
}

export function getHealth() {
  return {
    ok: true,
    adapter: "zca-js",
    activeSessions: activeSessions.size,
    connectedAccounts: listAccounts().length
  };
}
