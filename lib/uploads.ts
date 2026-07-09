import { put } from "@vercel/blob";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "projects");
const MAX_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

export async function saveProjectImage(file: File): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Faqat JPG, PNG, WEBP yoki GIF ruxsat etilgan");
  }

  if (file.size > MAX_SIZE) {
    throw new Error("Rasm hajmi 5MB dan oshmasligi kerak");
  }

  const ext = ALLOWED_TYPES.get(file.type) ?? "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`projects/${filename}`, buffer, {
      access: "public",
      contentType: file.type,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return blob.url;
  }

  if (process.env.VERCEL) {
    throw new Error("BLOB_READ_WRITE_TOKEN environment variable is required on Vercel");
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return `/uploads/projects/${filename}`;
}
