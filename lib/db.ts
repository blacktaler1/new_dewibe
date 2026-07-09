import Database from "better-sqlite3";
import { existsSync, mkdirSync, readFileSync } from "fs";
import path from "path";
import { defaultContent } from "./default-content";
import { toLocalized } from "./i18n";
import type { Lead, Project, SiteContent, SiteCopy, TeamMember } from "./types";

const DB_PATH = process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "dewibe.db");

type SqliteDatabase = Database.Database;

declare global {
  // eslint-disable-next-line no-var
  var __dewibeDb: SqliteDatabase | undefined;
}

function createConnection(): SqliteDatabase {
  const dir = path.dirname(DB_PATH);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  return db;
}

export function getDb(): SqliteDatabase {
  if (!global.__dewibeDb) {
    global.__dewibeDb = createConnection();
    initSchema(global.__dewibeDb);
    migrateIfNeeded(global.__dewibeDb);
  }
  return global.__dewibeDb;
}

function initSchema(db: SqliteDatabase) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS site_copy (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      data TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS team_members (
      id TEXT PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      role TEXT NOT NULL,
      image TEXT NOT NULL,
      social TEXT NOT NULL DEFAULT '{}',
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL,
      tags TEXT NOT NULL DEFAULT '[]',
      href TEXT NOT NULL DEFAULT '#',
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL,
      read INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS page_views (
      date TEXT PRIMARY KEY,
      count INTEGER NOT NULL DEFAULT 0
    );
  `);
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

function migrateIfNeeded(db: SqliteDatabase) {
  const seeded = db
    .prepare("SELECT value FROM meta WHERE key = 'seeded'")
    .get() as { value: string } | undefined;

  if (seeded?.value === "1") return;

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

  const seed = db.transaction(() => {
    db.prepare("DELETE FROM site_copy").run();
    db.prepare("DELETE FROM team_members").run();
    db.prepare("DELETE FROM projects").run();
    db.prepare("DELETE FROM leads").run();
    db.prepare("DELETE FROM page_views").run();

    db.prepare("INSERT INTO site_copy (id, data) VALUES (1, ?)").run(
      JSON.stringify(content.copy),
    );

    const insertMember = db.prepare(`
      INSERT INTO team_members (id, first_name, last_name, role, image, social, sort_order)
      VALUES (@id, @firstName, @lastName, @role, @image, @social, @sortOrder)
    `);

    content.team.forEach((member, index) => {
      insertMember.run({
        id: member.id,
        firstName: member.firstName,
        lastName: member.lastName,
        role: JSON.stringify(member.role),
        image: member.image,
        social: JSON.stringify(member.social ?? {}),
        sortOrder: index,
      });
    });

    const insertProject = db.prepare(`
      INSERT INTO projects (id, title, description, image, tags, href, sort_order)
      VALUES (@id, @title, @description, @image, @tags, @href, @sortOrder)
    `);

    content.projects.forEach((project, index) => {
      insertProject.run({
        id: project.id,
        title: JSON.stringify(project.title),
        description: JSON.stringify(project.description),
        image: project.image,
        tags: JSON.stringify(project.tags ?? []),
        href: project.href,
        sortOrder: index,
      });
    });

    if (Array.isArray(leadsJson)) {
      const insertLead = db.prepare(`
        INSERT INTO leads (id, name, email, message, created_at, read)
        VALUES (@id, @name, @email, @message, @createdAt, @read)
      `);
      for (const lead of leadsJson) {
        insertLead.run({
          id: lead.id,
          name: lead.name,
          email: lead.email,
          message: lead.message,
          createdAt: lead.createdAt,
          read: lead.read ? 1 : 0,
        });
      }
    }

    db.prepare(
      "INSERT OR REPLACE INTO meta (key, value) VALUES ('seeded', '1')",
    ).run();
  });

  seed();
  clearFakeAnalytics(db);
}

function clearFakeAnalytics(db: SqliteDatabase) {
  const cleared = db
    .prepare("SELECT value FROM meta WHERE key = 'analytics_real_v1'")
    .get() as { value: string } | undefined;

  if (cleared?.value === "1") return;

  db.prepare("DELETE FROM page_views").run();
  db.prepare(
    "INSERT OR REPLACE INTO meta (key, value) VALUES ('analytics_real_v1', '1')",
  ).run();
}

export function rowToTeamMember(row: {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  image: string;
  social: string;
}): TeamMember {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    role: JSON.parse(row.role),
    image: row.image,
    social: JSON.parse(row.social),
  };
}

export function rowToProject(row: {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string;
  href: string;
}): Project {
  return {
    id: row.id,
    title: JSON.parse(row.title),
    description: JSON.parse(row.description),
    image: row.image,
    tags: JSON.parse(row.tags),
    href: row.href,
  };
}

export function rowToLead(row: {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  read: number;
}): Lead {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    message: row.message,
    createdAt: row.created_at,
    read: Boolean(row.read),
  };
}

export function readSiteCopyFromDb(): SiteCopy {
  const row = getDb()
    .prepare("SELECT data FROM site_copy WHERE id = 1")
    .get() as { data: string } | undefined;

  if (!row) {
    return defaultContent.copy;
  }

  return JSON.parse(row.data) as SiteCopy;
}
