import { getDb } from "./db";
import { readLeads } from "./leads-file";
import type {
  AnalyticsStats,
  AnalyticsSummary,
  DailyAnalytics,
} from "./types";

function dateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function readPageViews(): Record<string, number> {
  const rows = getDb()
    .prepare("SELECT date, count FROM page_views")
    .all() as { date: string; count: number }[];

  const views: Record<string, number> = {};
  for (const row of rows) {
    views[row.date] = row.count;
  }
  return views;
}

function buildLeadCounts(leads: Awaited<ReturnType<typeof readLeads>>) {
  const leadCounts: Record<string, number> = {};
  for (const lead of leads) {
    const key = lead.createdAt.slice(0, 10);
    leadCounts[key] = (leadCounts[key] ?? 0) + 1;
  }
  return leadCounts;
}

function buildDailyMetrics(
  pageViews: Record<string, number>,
  leadCounts: Record<string, number>,
): DailyAnalytics[] {
  const today = new Date();
  const daily: DailyAnalytics[] = [];

  for (let i = 29; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = dateKey(d);
    daily.push({
      date: key,
      pageViews: pageViews[key] ?? 0,
      leads: leadCounts[key] ?? 0,
    });
  }

  return daily;
}

function buildWeeklyPageViews(daily: DailyAnalytics[]) {
  const weeklyPageViews: { label: string; value: number }[] = [];

  for (let week = 3; week >= 0; week -= 1) {
    const start = daily.length - (week + 1) * 7;
    const slice = daily.slice(Math.max(0, start), Math.max(0, start) + 7);
    const value = slice.reduce((sum, item) => sum + item.pageViews, 0);
    const first = slice[0]?.date;
    const last = slice[slice.length - 1]?.date;

    const label =
      first && last
        ? `${formatShortDate(first)} – ${formatShortDate(last)}`
        : `W${4 - week}`;

    weeklyPageViews.push({ label, value });
  }

  return weeklyPageViews;
}

function formatShortDate(date: string) {
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString("uz-UZ", { day: "2-digit", month: "short" });
}

function buildMonthlyLeads(leads: Awaited<ReturnType<typeof readLeads>>) {
  const monthlyMap = new Map<string, number>();
  for (const lead of leads) {
    const month = lead.createdAt.slice(0, 7);
    monthlyMap.set(month, (monthlyMap.get(month) ?? 0) + 1);
  }

  return Array.from(monthlyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, value]) => ({
      label: month,
      value,
    }));
}

async function buildAnalyticsData() {
  const [pageViews, leads] = await Promise.all([readPageViews(), readLeads()]);
  const leadCounts = buildLeadCounts(leads);
  const daily = buildDailyMetrics(pageViews, leadCounts);
  const totalPageViews = Object.values(pageViews).reduce(
    (sum, count) => sum + count,
    0,
  );
  const totalLeads = leads.length;
  const unreadLeads = leads.filter((lead) => !lead.read).length;
  const conversionRate =
    totalPageViews > 0
      ? Number(((totalLeads / totalPageViews) * 100).toFixed(2))
      : 0;

  const stats: AnalyticsStats = {
    totalPageViews,
    totalLeads,
    unreadLeads,
    conversionRate,
  };

  return {
    stats,
    daily,
    weeklyPageViews: buildWeeklyPageViews(daily),
    monthlyLeads: buildMonthlyLeads(leads),
  };
}

export async function trackPageView(): Promise<void> {
  const db = getDb();
  const key = dateKey();

  db.prepare(
    `
    INSERT INTO page_views (date, count) VALUES (?, 1)
    ON CONFLICT(date) DO UPDATE SET count = count + 1
  `,
  ).run(key);
}

export async function getAnalyticsStats(): Promise<AnalyticsStats> {
  const data = await buildAnalyticsData();
  return data.stats;
}

export async function getDailyAnalytics(): Promise<DailyAnalytics[]> {
  const data = await buildAnalyticsData();
  return data.daily;
}

export async function getWeeklyPageViews(): Promise<{ label: string; value: number }[]> {
  const data = await buildAnalyticsData();
  return data.weeklyPageViews;
}

export async function getMonthlyLeads(): Promise<{ label: string; value: number }[]> {
  const data = await buildAnalyticsData();
  return data.monthlyLeads;
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const data = await buildAnalyticsData();
  return {
    ...data.stats,
    daily: data.daily,
    weeklyPageViews: data.weeklyPageViews,
    monthlyLeads: data.monthlyLeads,
  };
}
