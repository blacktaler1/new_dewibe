import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";

export async function requireAnalyticsAuth() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
