"use client";

import { useEffect, useState } from "react";
import { EnvelopeSimple, Trash } from "@phosphor-icons/react";
import type { Lead } from "@/lib/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("uz-UZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function LeadsPanel() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const loadLeads = () => {
    setLoading(true);
    fetch("/api/leads", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Lead[]) => {
        setLeads(data);
        if (data.length > 0 && !selectedId) {
          setSelectedId(data[0].id);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const markRead = async (id: string) => {
    await fetch("/api/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read: true }),
    });
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, read: true } : lead)),
    );
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Leadni o'chirishni tasdiqlaysizmi?")) return;
    await fetch(`/api/leads?id=${id}`, { method: "DELETE" });
    setLeads((prev) => {
      const next = prev.filter((lead) => lead.id !== id);
      if (selectedId === id) {
        setSelectedId(next[0]?.id ?? null);
      }
      return next;
    });
  };

  const selectedLead = leads.find((lead) => lead.id === selectedId) ?? null;

  if (loading) {
    return <p className="dashboard-empty">Leads yuklanmoqda...</p>;
  }

  if (leads.length === 0) {
    return (
      <div className="leads-empty glass-card">
        <EnvelopeSimple size={32} weight="duotone" color="#8A63F8" />
        <p>Hali contact formadan xabar yo&apos;q</p>
      </div>
    );
  }

  return (
    <div className="leads-panel">
      <div className="leads-list">
        {leads.map((lead) => (
          <button
            key={lead.id}
            type="button"
            className={`lead-item glass-card${selectedId === lead.id ? " active" : ""}${
              !lead.read ? " unread" : ""
            }`}
            onClick={() => {
              setSelectedId(lead.id);
              if (!lead.read) markRead(lead.id);
            }}
          >
            <div className="lead-item-top">
              <h3>{lead.name}</h3>
              {!lead.read && <span className="lead-badge">Yangi</span>}
            </div>
            <p className="lead-email">{lead.email}</p>
            <p className="lead-preview">{lead.message}</p>
            <p className="lead-date">{formatDate(lead.createdAt)}</p>
          </button>
        ))}
      </div>

      {selectedLead && (
        <article className="lead-detail glass-card">
          <div className="lead-detail-header">
            <div>
              <h2>{selectedLead.name}</h2>
              <a href={`mailto:${selectedLead.email}`} className="lead-detail-email">
                {selectedLead.email}
              </a>
              <p className="lead-date">{formatDate(selectedLead.createdAt)}</p>
            </div>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => deleteLead(selectedLead.id)}
            >
              <Trash size={14} weight="bold" style={{ marginRight: "0.35rem" }} />
              O&apos;chirish
            </button>
          </div>
          <div className="lead-detail-message">
            <p>{selectedLead.message}</p>
          </div>
        </article>
      )}
    </div>
  );
}
