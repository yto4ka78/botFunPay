import crypto from "crypto";
import jwt from "jsonwebtoken";
//For User

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;
const isProd = process.env.NODE_ENV === "production";
export const ACCESS_COOKIE_NAME = isProd ? "__Host-access" : "access";
export const REFRESH_COOKIE_NAME = isProd ? "__Host-refresh" : "refresh";
export const XSRF_COOKIE_NAME = "XSRF-TOKEN";

export const baseHttpOnly = {
  httpOnly: true,
  secure: isProd,
  sameSite: "strict",
  path: "/",
};

export const accessCookie = {
  ...baseHttpOnly,
  maxAge: 15 * 60 * 1000,
};

export const refreshCookie = {
  ...baseHttpOnly,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const xsrfCookie = {
  httpOnly: false,
  secure: isProd,
  sameSite: "lax",
  path: "/",
};

//accessCookie time ti live of cookie.
export function setAuthCookies(res, { access, refresh }) {
  res.cookie(ACCESS_COOKIE_NAME, access, accessCookie);
  res.cookie(REFRESH_COOKIE_NAME, refresh, refreshCookie);
}

export function clearAuthCookies(res) {
  res.clearCookie(ACCESS_COOKIE_NAME, { path: "/" });
  res.clearCookie(REFRESH_COOKIE_NAME, { path: "/" });
  res.clearCookie(XSRF_COOKIE_NAME, { path: "/" });
}

// expiresIn: "15m" time ti live of token.
export function signAccess(payload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
}
export function signRefresh(sub) {
  return jwt.sign({ sub, type: "refresh" }, REFRESH_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token, isRefresh = false) {
  const secret = isRefresh ? REFRESH_SECRET : ACCESS_SECRET;
  return jwt.verify(token, secret);
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
