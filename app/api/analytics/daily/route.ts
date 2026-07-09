import { NextResponse } from "next/server";
import { getDailyAnalytics } from "@/lib/analytics-file";
import { requireAnalyticsAuth } from "@/lib/analytics-api";

export const dynamic = "force-dynamic";

export async function GET() {
  const authError = await requireAnalyticsAuth();
  if (authError) return authError;

  const daily = await getDailyAnalytics();
  return NextResponse.json(daily);
}
