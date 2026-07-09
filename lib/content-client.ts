import type { SiteContent } from "./types";
import { defaultContent } from "./default-content";

export async function fetchContent(): Promise<SiteContent> {
  try {
    const res = await fetch("/api/content", { cache: "no-store" });
    if (!res.ok) return defaultContent;
    const data = (await res.json()) as SiteContent;
    if (!data.copy) return { ...defaultContent, ...data, copy: defaultContent.copy };
    if (!data.team?.length && !data.projects?.length) return defaultContent;
    return data;
  } catch {
    return defaultContent;
  }
}

export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
