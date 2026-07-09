import { cookies } from "next/headers";
import { verifySessionToken } from "./session";

const SESSION_COOKIE = "dewibe_session";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@dewibe.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "dewibe123";

export function getAdminCredentials() {
  return { email: ADMIN_EMAIL, password: ADMIN_PASSWORD };
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export { SESSION_COOKIE };
export { createSessionToken } from "./session";
