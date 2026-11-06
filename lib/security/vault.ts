import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96-bit IV recommended for AES-GCM
const AUTH_TAG_LENGTH = 16; // 128-bit authentication tag

export interface EncryptedPayload {
  ciphertext: string;
  iv: string;
  tag: string;
}

/**
 * Retrieves and validates the 32-byte AES-256 encryption key from the environment.
 */
function getMasterKey(): Buffer {
  const rawKey = process.env.ENCRYPTION_MASTER_KEY;
  if (!rawKey) {
    throw new Error(
      "CRITICAL SECURITY ERROR: ENCRYPTION_MASTER_KEY environment variable is missing."
    );
  }

  // Support 64-char hex strings (32 bytes)
  if (rawKey.length === 64 && /^[0-9a-fA-F]+$/.test(rawKey)) {
    return Buffer.from(rawKey, "hex");
  }

  // Support 32-byte UTF-8 or base64 strings
  const buffer = Buffer.from(rawKey, rawKey.includes("=") ? "base64" : "utf-8");
  if (buffer.length !== 32) {
    // If key length is not 32 bytes, derive a deterministic 32-byte key using SHA-256
    return crypto.createHash("sha256").update(rawKey).digest();
  }

  return buffer;
}

/**
 * Encrypts a plain text string using AES-256-GCM.
 * Generates a cryptographically random initialization vector (IV) for every invocation.
 */
export function encryptSecret(plainText: string): EncryptedPayload {
  if (!plainText) {
    throw new Error("Cannot encrypt empty or null secret.");
  }

  const key = getMasterKey();
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");

  const tag = cipher.getAuthTag();

  return {
    ciphertext: encrypted,
    iv: iv.toString("hex"),
    tag: tag.toString("hex"),
  };
}

/**
 * Decrypts an AES-256-GCM encrypted payload and verifies authenticity.
 * Throws an error if ciphertext or tag was tampered with.
 */
export function decryptSecret(ciphertext: string, iv: string, tag: string): string {
  if (!ciphertext || !iv || !tag) {
    throw new Error("Missing parameters for decryption: ciphertext, iv, and tag are required.");
  }

  const key = getMasterKey();
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    key,
    Buffer.from(iv, "hex"),
    { authTagLength: AUTH_TAG_LENGTH }
  );

  decipher.setAuthTag(Buffer.from(tag, "hex"));

  let decrypted = decipher.update(ciphertext, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

/**
 * Helper to encrypt arbitrary JSON objects (OAuth tokens, API credentials, extra headers).
 */
export function encryptObject(obj: Record<string, unknown>): EncryptedPayload {
  return encryptSecret(JSON.stringify(obj));
}

/**
 * Helper to decrypt and parse an encrypted JSON object.
 */
export function decryptObject<T = Record<string, unknown>>(
  ciphertext: string,
  iv: string,
  tag: string
): T {
  const raw = decryptSecret(ciphertext, iv, tag);
  return JSON.parse(raw) as T;
}

/**
 * Utility to generate a new 256-bit secure hex key for .env configuration.
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString("hex");
}

