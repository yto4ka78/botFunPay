import crypto from "crypto";
import jwt from "jsonwebtoken";
//For User

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

export function signAccess(payload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
}
export function signRefresh(payload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
}

//For Funpay accounts
const ALGO = "aes-256-gcm";
const KEY_HEX = process.env.CRYPTO_SECRET_HEX;

if (!KEY_HEX || KEY_HEX.length !== 64) {
  throw new Error(
    "CRYPTO_SECRET_HEX is missing or invalid (expected 64 hex chars)."
  );
}
const KEY = Buffer.from(KEY_HEX, "hex");

export function encryptGCM(plainText) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, KEY, iv);
  const enc = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `gcm:${iv.toString("hex")}:${tag.toString("hex")}:${enc.toString(
    "hex"
  )}`;
}

export function decryptGCM(payload) {
  if (typeof payload !== "string" || !payload.startsWith("gcm:")) {
    throw new Error("Encrypted payload format is invalid.");
  }
  const [, ivHex, tagHex, encHex] = payload.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const enc = Buffer.from(encHex, "hex");

  const decipher = crypto.createDecipheriv(ALGO, KEY, iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(enc), decipher.final()]);
  return dec.toString("utf8");
}

export function isGcmEnvelope(s) {
  return typeof s === "string" && s.startsWith("gcm:");
}
