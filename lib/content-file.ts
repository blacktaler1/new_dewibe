import { defaultContent } from "./default-content";
import { getDb, readSiteCopyFromDb, rowToProject, rowToTeamMember } from "./db";
import { toLocalized } from "./i18n";
import type { Project, SiteContent, TeamMember } from "./types";

function normalizeMember(member: Partial<TeamMember>): TeamMember {
  return {
    id: member.id ?? `${Date.now()}`,
    firstName: member.firstName ?? "",
    lastName: member.lastName ?? "",
    role: toLocalized(member.role as string | undefined),
    image: member.image ?? "",
    social: member.social ?? {},
  };
}

function normalizeProject(project: Partial<Project>): Project {
  return {
    id: project.id ?? `${Date.now()}`,
    title: toLocalized(project.title as string | undefined),
    description: toLocalized(project.description as string | undefined),
    image: project.image ?? "",
    tags: Array.isArray(project.tags) ? project.tags : [],
    href: project.href ?? "#",
  };
}

export async function readContent(): Promise<SiteContent> {
  const db = getDb();

  const teamRows = db
    .prepare(
      "SELECT id, first_name, last_name, role, image, social FROM team_members ORDER BY sort_order ASC",
    )
    .all() as {
    id: string;
    first_name: string;
    last_name: string;
    role: string;
    image: string;
    social: string;
  }[];

  const projectRows = db
    .prepare(
      "SELECT id, title, description, image, tags, href FROM projects ORDER BY sort_order ASC",
    )
    .all() as {
    id: string;
    title: string;
    description: string;
    image: string;
    tags: string;
    href: string;
  }[];

  const team =
    teamRows.length > 0
      ? teamRows.map(rowToTeamMember)
      : defaultContent.team.map((member) => normalizeMember(member));

  const projects =
    projectRows.length > 0
      ? projectRows.map(rowToProject)
      : defaultContent.projects.map((project) => normalizeProject(project));

  return {
    copy: readSiteCopyFromDb(),
    team,
    projects,
  };
}

export async function writeContent(content: SiteContent): Promise<void> {
  const db = getDb();

  const save = db.transaction(() => {
    db.prepare(
      "INSERT INTO site_copy (id, data) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data",
    ).run(JSON.stringify(content.copy));

    db.prepare("DELETE FROM team_members").run();
    const insertMember = db.prepare(`
      INSERT INTO team_members (id, first_name, last_name, role, image, social, sort_order)
      VALUES (@id, @firstName, @lastName, @role, @image, @social, @sortOrder)
    `);

    content.team.forEach((member, index) => {
      const normalized = normalizeMember(member);
      insertMember.run({
        id: normalized.id,
        firstName: normalized.firstName,
        lastName: normalized.lastName,
        role: JSON.stringify(normalized.role),
        image: normalized.image,
        social: JSON.stringify(normalized.social ?? {}),
        sortOrder: index,
      });
    });

    db.prepare("DELETE FROM projects").run();
    const insertProject = db.prepare(`
      INSERT INTO projects (id, title, description, image, tags, href, sort_order)
      VALUES (@id, @title, @description, @image, @tags, @href, @sortOrder)
    `);

    content.projects.forEach((project, index) => {
      const normalized = normalizeProject(project);
      insertProject.run({
        id: normalized.id,
        title: JSON.stringify(normalized.title),
        description: JSON.stringify(normalized.description),
        image: normalized.image,
        tags: JSON.stringify(normalized.tags),
        href: normalized.href,
        sortOrder: index,
      });
    });
  });

  save();
}
