import express from "express";
import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  abortSession,
  createQrSession,
  getHealth,
  getSession,
  listAccounts
} from "./zaloQrService.js";
import {
  getConversation,
  getListenerSummary,
  listConversations,
  listMessages,
  onMessage,
  refreshConversationsForAccount,
  resetUnread,
  startListenerForAccount,
  stopListenerForAccount
} from "./zaloListenerService.js";
import { startListenersForAllAccounts } from "./zaloListenerService.js";
import { dbPath } from "./db.js";

const app = express();
const port = Number(process.env.PORT || 8787);
const allowedOrigins = new Set([
  "http://127.0.0.1:5173",
  "http://localhost:5173",
  `http://127.0.0.1:${port}`,
  `http://localhost:${port}`
]);

// Add Belmo/production domains
if (process.env.ALLOWED_ORIGINS) {
  process.env.ALLOWED_ORIGINS.split(',').forEach(origin => allowedOrigins.add(origin.trim()));
}

app.use(express.json({ limit: "1mb" }));
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  next();
});

app.get("/api/health", (req, res) => {
  res.json({
    ...getHealth(),
    dbPath,
    listeners: getListenerSummary()
  });
});

app.get("/api/integrations/zalo-personal/accounts", (req, res) => {
  res.json({ accounts: listAccounts() });
});

app.get("/api/integrations/zalo-personal/listeners", (req, res) => {
  res.json({ listeners: getListenerSummary() });
});

app.post("/api/integrations/zalo-personal/accounts/:accountId/listener/start", async (req, res) => {
  try {
    const context = await startListenerForAccount(req.params.accountId);
    res.json({
      ok: true,
      status: context.status,
      accountId: req.params.accountId
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error?.message || "Không thể start listener.",
      detail: error?.stack
    });
  }
});

app.post("/api/integrations/zalo-personal/accounts/:accountId/listener/stop", (req, res) => {
  const stopped = stopListenerForAccount(req.params.accountId);
  res.json({ ok: stopped, accountId: req.params.accountId });
});

app.post("/api/integrations/zalo-personal/accounts/:accountId/listener/refresh", (req, res) => {
  refreshConversationsForAccount(req.params.accountId);
  res.json({ ok: true, accountId: req.params.accountId });
});

app.post("/api/integrations/zalo-personal/qr-session", (req, res) => {
  try {
    const session = createQrSession({
      displayName: req.body?.displayName
    });
    res.status(202).json({ session });
  } catch (error) {
    res.status(500).json({
      error: "Không thể tạo QR session Zalo.",
      detail: error?.message
    });
  }
});

app.get("/api/integrations/zalo-personal/qr-session/:id", (req, res) => {
  const session = getSession(req.params.id);
  if (!session) {
    res.status(404).json({ error: "Không tìm thấy QR session." });
    return;
  }
  res.json({ session });
});

app.delete("/api/integrations/zalo-personal/qr-session/:id", (req, res) => {
  const session = getSession(req.params.id);
  if (!session) {
    res.status(404).json({ error: "Không tìm thấy QR session." });
    return;
  }
  res.json({ session: abortSession(req.params.id) });
});

app.get("/api/integrations/zalo-personal/conversations", (req, res) => {
  const { accountId, search, limit } = req.query;
  const conversations = listConversations({
    accountId: accountId ? String(accountId) : undefined,
    search: search ? String(search) : undefined,
    limit: limit ? Number(limit) : undefined
  });
  res.json({ conversations });
});

app.get("/api/integrations/zalo-personal/conversations/:conversationId", (req, res) => {
  const conversation = getConversation(req.params.conversationId);
  if (!conversation) {
    res.status(404).json({ error: "Không tìm thấy hội thoại." });
    return;
  }
  res.json({ conversation });
});

app.get("/api/integrations/zalo-personal/conversations/:conversationId/messages", (req, res) => {
  const { limit } = req.query;
  const messages = listMessages({
    conversationId: req.params.conversationId,
    limit: limit ? Number(limit) : undefined
  });
  res.json({ messages });
});

app.post("/api/integrations/zalo-personal/conversations/:conversationId/read", (req, res) => {
  resetUnread(req.params.conversationId);
  res.json({ ok: true });
});

if (process.env.TOPAICHAT_ENABLE_TEST_ENDPOINT === "1") {
  app.post("/api/test/simulate-message", async (req, res) => {
    try {
      const { ThreadType } = await import("zca-js");
      const { __testHooks } = await import("./zaloListenerService.js");
      const { accountId, threadId, senderId, senderName, content, isSelf } = req.body || {};
      if (!accountId || !threadId) {
        res.status(400).json({ error: "Thiếu accountId hoặc threadId." });
        return;
      }
      const message = {
        type: ThreadType.User,
        threadId,
        data: {
          uidFrom: senderId || "0",
          dName: senderName || "Test",
          content: content || `Test ${new Date().toISOString()}`,
          msgId: `sim-${Date.now()}`,
          cliMsgId: `cli-sim-${Date.now()}`,
          ts: String(Date.now()),
          msgType: "text"
        },
        isSelf: !!isSelf
      };
      await __testHooks.handleIncomingMessage(accountId, message);
      res.json({ ok: true });
    } catch (error) {
      res.status(500).json({ error: error?.message });
    }
  });
}

app.get("/api/integrations/zalo-personal/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  if (typeof res.flushHeaders === "function") {
    res.flushHeaders();
  }

  const send = (event, payload) => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };

  send("ready", { ok: true, ts: new Date().toISOString() });

  const off = onMessage((message) => {
    send("message", message);
  });

  const heartbeat = setInterval(() => {
    send("ping", { ts: Date.now() });
  }, 15_000);

  req.on("close", () => {
    clearInterval(heartbeat);
    off();
    res.end();
  });
});

const distDir = join(process.cwd(), "dist");
if (existsSync(distDir)) {
  app.use(express.static(distDir));
  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) {
      next();
      return;
    }
    res.sendFile(join(distDir, "index.html"));
  });
}

const server = app.listen(port, "127.0.0.1", () => {
  console.log(`Top AiChat API listening on http://127.0.0.1:${port}`);
});

server.on("error", (error) => {
  console.error("API listen error", error?.message || error);
});

startListenersForAllAccounts()
  .then((results) => {
    const started = results.filter((item) => item.ok).length;
    const failed = results.filter((item) => !item.ok);
    console.log(`[boot] listener auto-start: ${started}/${results.length} tài khoản`);
    if (failed.length) {
      for (const item of failed) {
        console.log(`[boot] thất bại: ${item.displayName || item.accountId} – ${item.error}`);
      }
    }
  })
  .catch((error) => {
    console.error("[boot] auto-start listeners error", error?.message || error);
  });