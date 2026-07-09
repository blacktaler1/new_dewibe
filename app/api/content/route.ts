import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { readContent, writeContent } from "@/lib/content-file";
import type { SiteContent } from "@/lib/types";

export async function GET() {
  const content = await readContent();
  return NextResponse.json(content);
}

export async function PUT(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as SiteContent;

  if (!body.team || !body.projects || !body.copy) {
    return NextResponse.json({ error: "Invalid content" }, { status: 400 });
  }

  await writeContent(body);
  return NextResponse.json({ success: true });
}
