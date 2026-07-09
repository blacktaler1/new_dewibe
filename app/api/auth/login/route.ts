import { NextResponse } from "next/server";
import { createSessionToken, getAdminCredentials, SESSION_COOKIE } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body as { email?: string; password?: string };

  const { email: adminEmail, password: adminPassword } = getAdminCredentials();

  if (email !== adminEmail || password !== adminPassword) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = createSessionToken();
  const response = NextResponse.json({ success: true });

  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
