import { NextResponse } from "next/server";
import { trackPageView } from "@/lib/analytics-file";

export const dynamic = "force-dynamic";

export async function POST() {
  await trackPageView();
  return NextResponse.json({ success: true });
}
