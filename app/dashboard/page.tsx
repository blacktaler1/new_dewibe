"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Briefcase,
  ChartLine,
  EnvelopeSimple,
  SignOut,
  House,
  TextAa,
  UsersThree,
} from "@phosphor-icons/react";
import type { Lead, Project, SiteContent, TeamMember } from "@/lib/types";
import { L } from "@/lib/i18n";
import { fetchContent, generateId } from "@/lib/content-client";
import AnalyticsPanel from "./AnalyticsPanel";
import CopyEditor from "./CopyEditor";
import LeadsPanel from "./LeadsPanel";
import ImageUploadField from "@/components/dashboard/ImageUploadField";
import "./dashboard.css";

type Tab = "team" | "projects" | "copy" | "analytics" | "leads";

const NAV_ITEMS: {
  id: Tab;
  label: string;
  icon: typeof UsersThree;
  description: string;
}[] = [
  {
    id: "team",
    label: "Team",
    icon: UsersThree,
    description: "Jamoa a'zolarini boshqaring",
  },
  {
    id: "projects",
    label: "Products",
    icon: Briefcase,
    description: "Loyihalar va product kartalar",
  },
  {
    id: "copy",
    label: "Matnlar",
    icon: TextAa,
    description: "Sayt section matnlari (3 til)",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: ChartLine,
    description: "Tashriflar va leads statistikasi",
  },
  {
    id: "leads",
    label: "Leads",
    icon: EnvelopeSimple,
    description: "Contact formadan kelgan xabarlar",
  },
];

const emptyMember = (): TeamMember => ({
  id: generateId(),
  firstName: "",
  lastName: "",
  role: L("", "", ""),
  image: "",
  social: { instagram: "", linkedin: "", telegram: "" },
});

const emptyProject = (): Project => ({
  id: generateId(),
  title: L("", "", ""),
  description: L("", "", ""),
  image: "",
  tags: [],
  href: "#",
});

export default function DashboardPage() {
  const router = useRouter();
  const [content, setContent] = useState<SiteContent | null>(null);
  const [tab, setTab] = useState<Tab>("team");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [tagsInput, setTagsInput] = useState("");
  const [unreadLeads, setUnreadLeads] = useState(0);

  useEffect(() => {
    fetchContent().then(setContent);
  }, []);

  useEffect(() => {
    fetch("/api/leads", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : []))
      .then((leads: Lead[]) => setUnreadLeads(leads.filter((l) => !l.read).length))
      .catch(() => {});
  }, [tab]);

  useEffect(() => {
    const html = document.documentElement;
    const { body } = document;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, []);

  const saveContent = async (updated: SiteContent) => {
    setSaving(true);
    setStatus("");
    const res = await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    setSaving(false);

    if (res.ok) {
      setContent(updated);
      setStatus("Saqlandi!");
      setTimeout(() => setStatus(""), 3000);
    } else {
      setStatus("Saqlashda xatolik");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const deleteMember = (id: string) => {
    if (!content || !confirm("O'chirishni tasdiqlaysizmi?")) return;
    const updated = { ...content, team: content.team.filter((m) => m.id !== id) };
    saveContent(updated);
  };

  const deleteProject = (id: string) => {
    if (!content || !confirm("O'chirishni tasdiqlaysizmi?")) return;
    const updated = {
      ...content,
      projects: content.projects.filter((p) => p.id !== id),
    };
    saveContent(updated);
  };

  const saveMember = () => {
    if (!content || !editingMember) return;
    const exists = content.team.some((m) => m.id === editingMember.id);
    const team = exists
      ? content.team.map((m) => (m.id === editingMember.id ? editingMember : m))
      : [...content.team, editingMember];
    saveContent({ ...content, team });
    setEditingMember(null);
  };

  const saveProject = () => {
    if (!content || !editingProject) return;
    const project = {
      ...editingProject,
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    const exists = content.projects.some((p) => p.id === project.id);
    const projects = exists
      ? content.projects.map((p) => (p.id === project.id ? project : p))
      : [...content.projects, project];
    saveContent({ ...content, projects });
    setEditingProject(null);
    setTagsInput("");
  };

  if (!content) {
    return (
      <div className="dashboard-page">
        <p style={{ color: "#d5d5d5", textAlign: "center", padding: "4rem" }}>
          Yuklanmoqda...
        </p>
      </div>
    );
  }

  const activeNav = NAV_ITEMS.find((item) => item.id === tab);

  return (
    <div className="dashboard-page">
      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <div className="dashboard-sidebar-brand">DEWIBE</div>

          <nav className="dashboard-sidebar-nav" aria-label="Dashboard">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const count =
                item.id === "team"
                  ? content.team.length
                  : item.id === "projects"
                    ? content.projects.length
                    : item.id === "leads" && unreadLeads > 0
                      ? unreadLeads
                      : null;

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`dashboard-sidebar-link${tab === item.id ? " active" : ""}`}
                  onClick={() => setTab(item.id)}
                >
                  <Icon size={20} weight={tab === item.id ? "fill" : "duotone"} />
                  <span>
                    {item.label}
                    {count !== null ? ` (${count})` : ""}
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="dashboard-sidebar-footer">
            <Link href="/" className="btn btn-outline btn-sm">
              <House size={16} weight="bold" style={{ marginRight: "0.4rem" }} />
              Saytga qaytish
            </Link>
            <button type="button" className="btn btn-outline btn-sm" onClick={handleLogout}>
              <SignOut size={16} weight="bold" style={{ marginRight: "0.4rem" }} />
              Chiqish
            </button>
          </div>
        </aside>

        <main className="dashboard-main">
          {tab !== "copy" && (
            <header className="dashboard-header">
              <h1 className="dashboard-title">{activeNav?.label}</h1>
              <p className="dashboard-subtitle">{activeNav?.description}</p>
            </header>
          )}

          <div className="dashboard-inner">
            {status && <p className="dashboard-status success">{status}</p>}

            {tab === "analytics" && <AnalyticsPanel active={tab === "analytics"} />}

            {tab === "leads" && <LeadsPanel />}

            {tab === "copy" && (
              <CopyEditor
                copy={content.copy}
                onChange={(copy) => setContent((prev) => (prev ? { ...prev, copy } : prev))}
                onSave={() => {
                  setContent((prev) => {
                    if (prev) saveContent(prev);
                    return prev;
                  });
                }}
                saving={saving}
              />
            )}

            {tab === "team" && (
          <>
            <div className="dashboard-toolbar">
              <p style={{ color: "#d5d5d5" }}>Jamoa a&apos;zolari</p>
              <button
                type="button"
                className="btn btn-primary btn-sm cursor-target"
                onClick={() => setEditingMember(emptyMember())}
              >
                + A&apos;zo qo&apos;shish
              </button>
            </div>
            <div className="dashboard-list">
              {content.team.length === 0 && (
                <p className="dashboard-empty">Hali jamoa a&apos;zosi yo&apos;q</p>
              )}
              {content.team.map((member) => (
                <div key={member.id} className="dashboard-item glass-card">
                  <img
                    src={member.image}
                    alt={member.firstName}
                    className="dashboard-item-thumb"
                  />
                  <div className="dashboard-item-info">
                    <h3>
                      {member.firstName} {member.lastName}
                    </h3>
                    <p>{member.role.en || member.role.uz || member.role.ru}</p>
                  </div>
                  <div className="dashboard-item-actions">
                    <button
                      type="button"
                      className="btn btn-outline btn-sm cursor-target"
                      onClick={() => setEditingMember({ ...member })}
                    >
                      Tahrirlash
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm cursor-target"
                      onClick={() => deleteMember(member.id)}
                    >
                      O&apos;chirish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "projects" && (
          <>
            <div className="dashboard-toolbar">
              <p style={{ color: "#d5d5d5" }}>Product / loyihalar</p>
              <button
                type="button"
                className="btn btn-primary btn-sm cursor-target"
                onClick={() => {
                  setEditingProject(emptyProject());
                  setTagsInput("");
                }}
              >
                + Product qo&apos;shish
              </button>
            </div>
            <div className="dashboard-list">
              {content.projects.length === 0 && (
                <p className="dashboard-empty">Hali product yo&apos;q</p>
              )}
              {content.projects.map((project) => (
                <div key={project.id} className="dashboard-item glass-card">
                  <img
                    src={project.image}
                    alt={project.title.en || "Project"}
                    className="dashboard-item-thumb"
                  />
                  <div className="dashboard-item-info">
                    <h3>{project.title.en || project.title.uz || project.title.ru}</h3>
                    <p>{project.description.en || project.description.uz || project.description.ru}</p>
                  </div>
                  <div className="dashboard-item-actions">
                    <button
                      type="button"
                      className="btn btn-outline btn-sm cursor-target"
                      onClick={() => {
                        setEditingProject({ ...project });
                        setTagsInput(project.tags.join(", "));
                      }}
                    >
                      Tahrirlash
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm cursor-target"
                      onClick={() => deleteProject(project.id)}
                    >
                      O&apos;chirish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
          </div>
        </main>
      </div>

      {editingMember && (
        <div className="dashboard-form-overlay" onClick={() => setEditingMember(null)}>
          <div
            className="dashboard-form-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{content.team.some((m) => m.id === editingMember.id) ? "A'zoni tahrirlash" : "Yangi a'zo"}</h2>
            <div className="dashboard-form-grid">
              <div className="form-group">
                <label className="form-label">Ism</label>
                <input
                  className="form-input"
                  value={editingMember.firstName}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, firstName: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Familiya</label>
                <input
                  className="form-input"
                  value={editingMember.lastName}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, lastName: e.target.value })
                  }
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Lavozim (EN)</label>
                <input
                  className="form-input"
                  value={editingMember.role.en}
                  onChange={(e) =>
                    setEditingMember({
                      ...editingMember,
                      role: { ...editingMember.role, en: e.target.value },
                    })
                  }
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Lavozim (UZ)</label>
                <input
                  className="form-input"
                  value={editingMember.role.uz}
                  onChange={(e) =>
                    setEditingMember({
                      ...editingMember,
                      role: { ...editingMember.role, uz: e.target.value },
                    })
                  }
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Lavozim (RU)</label>
                <input
                  className="form-input"
                  value={editingMember.role.ru}
                  onChange={(e) =>
                    setEditingMember({
                      ...editingMember,
                      role: { ...editingMember.role, ru: e.target.value },
                    })
                  }
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Rasm URL</label>
                <input
                  className="form-input"
                  value={editingMember.image}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, image: e.target.value })
                  }
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Instagram</label>
                <input
                  className="form-input"
                  value={editingMember.social.instagram || ""}
                  onChange={(e) =>
                    setEditingMember({
                      ...editingMember,
                      social: { ...editingMember.social, instagram: e.target.value },
                    })
                  }
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">LinkedIn</label>
                <input
                  className="form-input"
                  value={editingMember.social.linkedin || ""}
                  onChange={(e) =>
                    setEditingMember({
                      ...editingMember,
                      social: { ...editingMember.social, linkedin: e.target.value },
                    })
                  }
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Telegram</label>
                <input
                  className="form-input"
                  value={editingMember.social.telegram || ""}
                  onChange={(e) =>
                    setEditingMember({
                      ...editingMember,
                      social: { ...editingMember.social, telegram: e.target.value },
                    })
                  }
                />
              </div>
            </div>
            <div className="dashboard-form-actions">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setEditingMember(null)}
              >
                Bekor
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={saveMember}
                disabled={saving}
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}

      {editingProject && (
        <div className="dashboard-form-overlay" onClick={() => setEditingProject(null)}>
          <div
            className="dashboard-form-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>
              {content.projects.some((p) => p.id === editingProject.id)
                ? "Productni tahrirlash"
                : "Yangi product"}
            </h2>
            <div className="dashboard-form-grid">
              <div className="form-group full-width">
                <label className="form-label">Nomi (EN)</label>
                <input
                  className="form-input"
                  value={editingProject.title.en}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      title: { ...editingProject.title, en: e.target.value },
                    })
                  }
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Nomi (UZ)</label>
                <input
                  className="form-input"
                  value={editingProject.title.uz}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      title: { ...editingProject.title, uz: e.target.value },
                    })
                  }
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Nomi (RU)</label>
                <input
                  className="form-input"
                  value={editingProject.title.ru}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      title: { ...editingProject.title, ru: e.target.value },
                    })
                  }
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Tavsif (EN)</label>
                <textarea
                  className="form-textarea"
                  value={editingProject.description.en}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      description: { ...editingProject.description, en: e.target.value },
                    })
                  }
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Tavsif (UZ)</label>
                <textarea
                  className="form-textarea"
                  value={editingProject.description.uz}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      description: { ...editingProject.description, uz: e.target.value },
                    })
                  }
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Tavsif (RU)</label>
                <textarea
                  className="form-textarea"
                  value={editingProject.description.ru}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      description: { ...editingProject.description, ru: e.target.value },
                    })
                  }
                />
              </div>
              <div className="form-group full-width">
                <ImageUploadField
                  label="Rasm"
                  value={editingProject.image}
                  onChange={(image) =>
                    setEditingProject({ ...editingProject, image })
                  }
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Teglar (vergul bilan)</label>
                <input
                  className="form-input"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="UI/UX, React, Dashboard"
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Link</label>
                <input
                  className="form-input"
                  value={editingProject.href}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, href: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="dashboard-form-actions">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setEditingProject(null)}
              >
                Bekor
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={saveProject}
                disabled={saving}
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
