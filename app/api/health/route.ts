import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks = {
    database: isDatabaseConfigured(),
    authSecret: Boolean(process.env.AUTH_SECRET),
    adminEmail: Boolean(process.env.ADMIN_EMAIL),
    adminPassword: Boolean(process.env.ADMIN_PASSWORD),
    blob: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    tursoUrl: Boolean(process.env.TURSO_DATABASE_URL),
    tursoToken: Boolean(process.env.TURSO_AUTH_TOKEN),
  };

  const ok =
    checks.database &&
    checks.authSecret &&
    checks.adminEmail &&
    checks.adminPassword;

  return NextResponse.json(
    {
      ok,
      checks,
      hint: ok
        ? "Configuration looks good"
        : "Set missing environment variables in Vercel project settings",
    },
    { status: ok ? 200 : 503 },
  );
}
