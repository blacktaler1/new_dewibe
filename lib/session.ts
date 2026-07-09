import { createHmac, timingSafeEqual } from "crypto";

const SECRET = process.env.AUTH_SECRET || "dewibe-dev-secret-change-me";

function sign(value: string) {
  return createHmac("sha256", SECRET).update(value).digest("hex");
}

export function createSessionToken() {
  const payload = `admin:${Date.now()}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined) {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = sign(payload);
  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}
