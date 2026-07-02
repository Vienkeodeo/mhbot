import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { DatabaseSync } from "node:sqlite";

const dataDir = join(process.cwd(), ".data");
mkdirSync(dataDir, { recursive: true });

export const dbPath = process.env.TOPAICHAT_DB_PATH || join(dataDir, "topaichat.sqlite");
mkdirSync(dirname(dbPath), { recursive: true });

export const db = new DatabaseSync(dbPath);

db.exec(`
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS zalo_qr_sessions (
    id TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    status TEXT NOT NULL,
    qr_code TEXT,
    qr_image TEXT,
    scanned_display_name TEXT,
    scanned_avatar TEXT,
    linked_display_name TEXT,
    linked_avatar TEXT,
    encrypted_credentials TEXT,
    error_message TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    expires_at TEXT,
    completed_at TEXT
  );

  CREATE TABLE IF NOT EXISTS zalo_accounts (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    display_name TEXT NOT NULL,
    avatar TEXT,
    status TEXT NOT NULL,
    encrypted_credentials TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    last_sync_at TEXT,
    FOREIGN KEY(session_id) REFERENCES zalo_qr_sessions(id)
  );

  CREATE TABLE IF NOT EXISTS zalo_listeners (
    account_id TEXT PRIMARY KEY,
    status TEXT NOT NULL,
    last_connected_at TEXT,
    last_disconnected_at TEXT,
    last_error TEXT,
    reconnect_attempts INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL,
    FOREIGN KEY(account_id) REFERENCES zalo_accounts(id)
  );

  CREATE TABLE IF NOT EXISTS zalo_conversations (
    id TEXT PRIMARY KEY,
    account_id TEXT NOT NULL,
    thread_id TEXT NOT NULL,
    thread_type TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT,
    last_message_preview TEXT,
    last_message_at TEXT,
    unread_count INTEGER NOT NULL DEFAULT 0,
    member_count INTEGER,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY(account_id) REFERENCES zalo_accounts(id),
    UNIQUE (account_id, thread_id)
  );

  CREATE INDEX IF NOT EXISTS idx_conversations_account
    ON zalo_conversations (account_id, last_message_at DESC);

  CREATE TABLE IF NOT EXISTS zalo_messages (
    id TEXT PRIMARY KEY,
    account_id TEXT NOT NULL,
    conversation_id TEXT NOT NULL,
    cli_msg_id TEXT,
    msg_id TEXT,
    thread_id TEXT NOT NULL,
    thread_type TEXT NOT NULL,
    sender_id TEXT NOT NULL,
    sender_name TEXT,
    is_self INTEGER NOT NULL DEFAULT 0,
    msg_type TEXT,
    content TEXT NOT NULL,
    quote TEXT,
    mentions TEXT,
    attachments TEXT,
    status INTEGER,
    delivered_at TEXT,
    ts TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY(account_id) REFERENCES zalo_accounts(id),
    FOREIGN KEY(conversation_id) REFERENCES zalo_conversations(id),
    UNIQUE (account_id, cli_msg_id)
  );

  CREATE INDEX IF NOT EXISTS idx_messages_conversation
    ON zalo_messages (conversation_id, ts ASC);

  CREATE INDEX IF NOT EXISTS idx_messages_account_ts
    ON zalo_messages (account_id, ts DESC);
`);

export function nowIso() {
  return new Date().toISOString();
}

export function run(sql, params = {}) {
  const statement = db.prepare(sql);
  return Array.isArray(params) ? statement.run(...params) : statement.run(params);
}

export function get(sql, params = {}) {
  const statement = db.prepare(sql);
  return Array.isArray(params) ? statement.get(...params) : statement.get(params);
}

export function all(sql, params = {}) {
  const statement = db.prepare(sql);
  return Array.isArray(params) ? statement.all(...params) : statement.all(params);
}