import HomePage from "@/components/HomePage";
import { trackPageView } from "@/lib/analytics-file";
import { readContent } from "@/lib/content-file";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await readContent();

  try {
    await trackPageView();
  } catch (error) {
    console.error("trackPageView failed:", error);
  }

  return <HomePage content={content} />;
}
