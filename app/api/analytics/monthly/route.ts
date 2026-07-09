import { NextResponse } from "next/server";
import { getMonthlyLeads } from "@/lib/analytics-file";
import { requireAnalyticsAuth } from "@/lib/analytics-api";

export const dynamic = "force-dynamic";

export async function GET() {
  const authError = await requireAnalyticsAuth();
  if (authError) return authError;

  const monthly = await getMonthlyLeads();
  return NextResponse.json(monthly);
}
