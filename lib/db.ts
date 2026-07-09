import { createClient, type Client } from "@libsql/client";
import { existsSync, mkdirSync, readFileSync } from "fs";
import path from "path";
import { defaultContent } from "./default-content";
import { toLocalized } from "./i18n";
import type { Lead, Project, SiteContent, SiteCopy, TeamMember } from "./types";

const LOCAL_DB_PATH =
  process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "dewibe.db");

let client: Client | null = null;
let initPromise: Promise<void> | null = null;

function getDatabaseUrl(): string {
  if (process.env.TURSO_DATABASE_URL) {
    return process.env.TURSO_DATABASE_URL;
  }

  if (process.env.VERCEL) {
    throw new Error("TURSO_DATABASE_URL environment variable is required on Vercel");
  }

  const dir = path.dirname(LOCAL_DB_PATH);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  return `file:${LOCAL_DB_PATH}`;
}

export async function getDb(): Promise<Client> {
  if (!client) {
    client = createClient({
      url: getDatabaseUrl(),
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }

  if (!initPromise) {
    initPromise = initializeDatabase(client);
  }

  await initPromise;
  return client;
}

async function initializeDatabase(db: Client) {
  await initSchema(db);
  await migrateIfNeeded(db);
}

async function initSchema(db: Client) {
  await db.batch(
    [
      `CREATE TABLE IF NOT EXISTS meta (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS site_copy (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        data TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS team_members (
        id TEXT PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        role TEXT NOT NULL,
        image TEXT NOT NULL,
        social TEXT NOT NULL DEFAULT '{}',
        sort_order INTEGER NOT NULL DEFAULT 0
      )`,
      `CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        image TEXT NOT NULL,
        tags TEXT NOT NULL DEFAULT '[]',
        href TEXT NOT NULL DEFAULT '#',
        sort_order INTEGER NOT NULL DEFAULT 0
      )`,
      `CREATE TABLE IF NOT EXISTS leads (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TEXT NOT NULL,
        read INTEGER NOT NULL DEFAULT 0
      )`,
      `CREATE TABLE IF NOT EXISTS page_views (
        date TEXT PRIMARY KEY,
        count INTEGER NOT NULL DEFAULT 0
      )`,
    ],
    "write",
  );
}

function readJsonFile<T>(filePath: string): T | null {
  try {
    if (!existsSync(filePath)) return null;
    return JSON.parse(readFileSync(filePath, "utf-8")) as T;
  } catch {
    return null;
  }
}

function normalizeMemberForSeed(member: Partial<TeamMember>): TeamMember {
  return {
    id: member.id ?? `${Date.now()}`,
    firstName: member.firstName ?? "",
    lastName: member.lastName ?? "",
    role: toLocalized(member.role as string | undefined),
    image: member.image ?? "",
    social: member.social ?? {},
  };
}

function normalizeProjectForSeed(project: Partial<Project>): Project {
  return {
    id: project.id ?? `${Date.now()}`,
    title: toLocalized(project.title as string | undefined),
    description: toLocalized(project.description as string | undefined),
    image: project.image ?? "",
    tags: Array.isArray(project.tags) ? project.tags : [],
    href: project.href ?? "#",
  };
}

async function migrateIfNeeded(db: Client) {
  const seeded = await db.execute({
    sql: "SELECT value FROM meta WHERE key = 'seeded'",
  });

  if (seeded.rows[0]?.value === "1") {
    await clearFakeAnalytics(db);
    return;
  }

  const dataDir = path.join(process.cwd(), "data");
  const contentJson = readJsonFile<Partial<SiteContent>>(path.join(dataDir, "content.json"));
  const leadsJson = readJsonFile<Lead[]>(path.join(dataDir, "leads.json"));

  const content: SiteContent = {
    copy: contentJson?.copy ?? defaultContent.copy,
    team: Array.isArray(contentJson?.team)
      ? contentJson.team.map((member) => normalizeMemberForSeed(member))
      : defaultContent.team,
    projects: Array.isArray(contentJson?.projects)
      ? contentJson.projects.map((project) => normalizeProjectForSeed(project))
      : defaultContent.projects,
  };

  const statements = [
    { sql: "DELETE FROM site_copy", args: [] as string[] },
    { sql: "DELETE FROM team_members", args: [] as string[] },
    { sql: "DELETE FROM projects", args: [] as string[] },
    { sql: "DELETE FROM leads", args: [] as string[] },
    { sql: "DELETE FROM page_views", args: [] as string[] },
    {
      sql: "INSERT INTO site_copy (id, data) VALUES (1, ?)",
      args: [JSON.stringify(content.copy)],
    },
  ];

  for (const [index, member] of content.team.entries()) {
    statements.push({
      sql: `INSERT INTO team_members (id, first_name, last_name, role, image, social, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        member.id,
        member.firstName,
        member.lastName,
        JSON.stringify(member.role),
        member.image,
        JSON.stringify(member.social ?? {}),
        String(index),
      ],
    });
  }

  for (const [index, project] of content.projects.entries()) {
    statements.push({
      sql: `INSERT INTO projects (id, title, description, image, tags, href, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        project.id,
        JSON.stringify(project.title),
        JSON.stringify(project.description),
        project.image,
        JSON.stringify(project.tags ?? []),
        project.href,
        String(index),
      ],
    });
  }

  if (Array.isArray(leadsJson)) {
    for (const lead of leadsJson) {
      statements.push({
        sql: `INSERT INTO leads (id, name, email, message, created_at, read)
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [
          lead.id,
          lead.name,
          lead.email,
          lead.message,
          lead.createdAt,
          lead.read ? "1" : "0",
        ],
      });
    }
  }

  statements.push({
    sql: "INSERT OR REPLACE INTO meta (key, value) VALUES ('seeded', '1')",
    args: [],
  });

  await db.batch(statements, "write");
  await clearFakeAnalytics(db);
}

async function clearFakeAnalytics(db: Client) {
  const cleared = await db.execute({
    sql: "SELECT value FROM meta WHERE key = 'analytics_real_v1'",
  });

  if (cleared.rows[0]?.value === "1") return;

  await db.batch(
    [
      { sql: "DELETE FROM page_views", args: [] },
      {
        sql: "INSERT OR REPLACE INTO meta (key, value) VALUES ('analytics_real_v1', '1')",
        args: [],
      },
    ],
    "write",
  );
}

export function rowToTeamMember(row: Record<string, unknown>): TeamMember {
  return {
    id: String(row.id),
    firstName: String(row.first_name),
    lastName: String(row.last_name),
    role: JSON.parse(String(row.role)),
    image: String(row.image),
    social: JSON.parse(String(row.social ?? "{}")),
  };
}

export function rowToProject(row: Record<string, unknown>): Project {
  return {
    id: String(row.id),
    title: JSON.parse(String(row.title)),
    description: JSON.parse(String(row.description)),
    image: String(row.image),
    tags: JSON.parse(String(row.tags ?? "[]")),
    href: String(row.href),
  };
}

export function rowToLead(row: Record<string, unknown>): Lead {
  return {
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    message: String(row.message),
    createdAt: String(row.created_at),
    read: Boolean(Number(row.read)),
  };
}

export async function readSiteCopyFromDb(): Promise<SiteCopy> {
  const db = await getDb();
  const result = await db.execute({
    sql: "SELECT data FROM site_copy WHERE id = 1",
  });

  const data = result.rows[0]?.data;
  if (!data) {
    return defaultContent.copy;
  }

  return JSON.parse(String(data)) as SiteCopy;
}
