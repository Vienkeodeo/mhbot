import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

const secretPath = process.env.TOPAICHAT_SECRET_PATH || join(process.cwd(), ".data", "secret.key");

function loadSecret() {
  if (process.env.TOPAICHAT_SESSION_SECRET) {
    return createHash("sha256").update(process.env.TOPAICHAT_SESSION_SECRET).digest();
  }

  if (!existsSync(secretPath)) {
    mkdirSync(dirname(secretPath), { recursive: true });
    writeFileSync(secretPath, randomBytes(32), { mode: 0o600 });
  }

  return readFileSync(secretPath).subarray(0, 32);
}

const secret = loadSecret();

export function encryptJson(value) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", secret, iv);
  const plaintext = Buffer.from(JSON.stringify(value), "utf8");
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();

  return JSON.stringify({
    alg: "aes-256-gcm",
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    data: ciphertext.toString("base64")
  });
}

export function decryptJson(payload) {
  const parsed = JSON.parse(payload);
  const decipher = createDecipheriv(
    "aes-256-gcm",
    secret,
    Buffer.from(parsed.iv, "base64")
  );
  decipher.setAuthTag(Buffer.from(parsed.tag, "base64"));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(parsed.data, "base64")),
    decipher.final()
  ]);
  return JSON.parse(plaintext.toString("utf8"));
}
