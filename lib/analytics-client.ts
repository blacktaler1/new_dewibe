import type {
  AnalyticsStats,
  AnalyticsSummary,
  DailyAnalytics,
} from "./types";

const apiConfig: RequestInit = {
  cache: "no-store",
  credentials: "include",
};

async function parseJson<T>(res: Response): Promise<T | null> {
  if (!res.ok) return null;
  return (await res.json()) as T;
}

export async function fetchAnalyticsSummary(): Promise<AnalyticsSummary | null> {
  try {
    const res = await fetch("/api/analytics", apiConfig);
    return parseJson<AnalyticsSummary>(res);
  } catch {
    return null;
  }
}

export async function fetchAnalyticsStats(): Promise<AnalyticsStats | null> {
  try {
    const res = await fetch("/api/analytics/stats", apiConfig);
    return parseJson<AnalyticsStats>(res);
  } catch {
    return null;
  }
}

export async function fetchDailyAnalytics(): Promise<DailyAnalytics[] | null> {
  try {
    const res = await fetch("/api/analytics/daily", apiConfig);
    return parseJson<DailyAnalytics[]>(res);
  } catch {
    return null;
  }
}

export async function fetchWeeklyPageViews(): Promise<
  { label: string; value: number }[] | null
> {
  try {
    const res = await fetch("/api/analytics/weekly", apiConfig);
    return parseJson<{ label: string; value: number }[]>(res);
  } catch {
    return null;
  }
}

export async function fetchMonthlyLeads(): Promise<
  { label: string; value: number }[] | null
> {
  try {
    const res = await fetch("/api/analytics/monthly", apiConfig);
    return parseJson<{ label: string; value: number }[]>(res);
  } catch {
    return null;
  }
}

export async function fetchAllAnalytics() {
  const [stats, daily, weeklyPageViews, monthlyLeads] = await Promise.all([
    fetchAnalyticsStats(),
    fetchDailyAnalytics(),
    fetchWeeklyPageViews(),
    fetchMonthlyLeads(),
  ]);

  if (!stats || !daily || !weeklyPageViews || !monthlyLeads) {
    return null;
  }

  return {
    ...stats,
    daily,
    weeklyPageViews,
    monthlyLeads,
  } satisfies AnalyticsSummary;
}

export async function trackPageView(): Promise<boolean> {
  try {
    const res = await fetch("/api/analytics/track", {
      method: "POST",
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}
