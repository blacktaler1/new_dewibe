"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowsClockwise } from "@phosphor-icons/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fetchAllAnalytics } from "@/lib/analytics-client";
import type { AnalyticsSummary } from "@/lib/types";

const CHART_COLORS = {
  pageViews: "#5A8CFF",
  leads: "#8A63F8",
  bar: "#8A63F8",
};

function formatDay(date: string) {
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString("uz-UZ", { day: "2-digit", month: "short" });
}

interface AnalyticsPanelProps {
  active?: boolean;
}

export default function AnalyticsPanel({ active = true }: AnalyticsPanelProps) {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadAnalytics = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError("");

    const data = await fetchAllAnalytics();
    if (!data) {
      setError("Analitika endpointlaridan ma'lumot olinmadi");
      setAnalytics(null);
    } else {
      setAnalytics(data);
    }

    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    if (active) {
      loadAnalytics();
    }
  }, [active, loadAnalytics]);

  const lineData = useMemo(
    () =>
      analytics?.daily.map((item) => ({
        ...item,
        label: formatDay(item.date),
      })) ?? [],
    [analytics],
  );

  if (loading) {
    return <p className="dashboard-empty">Analitika yuklanmoqda...</p>;
  }

  if (!analytics) {
    return (
      <div className="analytics-error">
        <p className="dashboard-empty">{error || "Analitikani yuklab bo'lmadi"}</p>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={() => loadAnalytics()}
        >
          Qayta urinish
        </button>
      </div>
    );
  }

  return (
    <div className="analytics-panel">
      <div className="analytics-toolbar">
        <p className="analytics-endpoints">Faqat haqiqiy tashriflar va leads</p>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={() => loadAnalytics(true)}
          disabled={refreshing}
        >
          <ArrowsClockwise
            size={14}
            weight="bold"
            style={{ marginRight: "0.35rem" }}
            className={refreshing ? "spin-icon" : undefined}
          />
          Yangilash
        </button>
      </div>

      <div className="analytics-stats">
        <div className="analytics-stat glass-card">
          <p className="analytics-stat-label">Tashriflar</p>
          <p className="analytics-stat-value">{analytics.totalPageViews}</p>
        </div>
        <div className="analytics-stat glass-card">
          <p className="analytics-stat-label">Leads</p>
          <p className="analytics-stat-value">{analytics.totalLeads}</p>
        </div>
        <div className="analytics-stat glass-card">
          <p className="analytics-stat-label">O&apos;qilmagan</p>
          <p className="analytics-stat-value">{analytics.unreadLeads}</p>
        </div>
        <div className="analytics-stat glass-card">
          <p className="analytics-stat-label">Konversiya</p>
          <p className="analytics-stat-value">{analytics.conversionRate}%</p>
        </div>
      </div>

      <div className="analytics-charts">
        <div className="analytics-chart-card glass-card">
          <h3>Kunlik tashriflar va leads (line)</h3>
          <div className="analytics-chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="label" stroke="#888" tick={{ fill: "#aaa", fontSize: 12 }} />
                <YAxis stroke="#888" tick={{ fill: "#aaa", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: "#11111e",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 8,
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="pageViews"
                  name="Tashriflar"
                  stroke={CHART_COLORS.pageViews}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="leads"
                  name="Leads"
                  stroke={CHART_COLORS.leads}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="analytics-chart-card glass-card">
          <h3>Haftalik tashriflar (bar)</h3>
          <div className="analytics-chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.weeklyPageViews}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="label" stroke="#888" tick={{ fill: "#aaa", fontSize: 12 }} />
                <YAxis stroke="#888" tick={{ fill: "#aaa", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: "#11111e",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="value" name="Tashriflar" fill={CHART_COLORS.bar} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="analytics-chart-card glass-card">
          <h3>Oylik leads (bar)</h3>
          {analytics.monthlyLeads.length === 0 ? (
            <p className="dashboard-empty" style={{ padding: "2rem 0" }}>
              Hali lead yo&apos;q
            </p>
          ) : (
            <div className="analytics-chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.monthlyLeads}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="label" stroke="#888" tick={{ fill: "#aaa", fontSize: 12 }} />
                  <YAxis stroke="#888" tick={{ fill: "#aaa", fontSize: 12 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: "#11111e",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: 8,
                    }}
                  />
                  <Bar dataKey="value" name="Leads" fill="#00FF88" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
