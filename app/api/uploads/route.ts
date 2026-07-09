import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { saveProjectImage } from "@/lib/uploads";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Rasm tanlanmadi" }, { status: 400 });
    }

    const url = await saveProjectImage(file);
    return NextResponse.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Yuklashda xatolik";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
