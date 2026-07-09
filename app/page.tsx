import HomePage from "@/components/HomePage";
import { trackPageView } from "@/lib/analytics-file";
import { readContent } from "@/lib/content-file";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await readContent();
  await trackPageView();

  return <HomePage content={content} />;
}
