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
  try {
    const db = await getDb();

    const teamResult = await db.execute({
      sql: "SELECT id, first_name, last_name, role, image, social FROM team_members ORDER BY sort_order ASC",
    });

    const projectResult = await db.execute({
      sql: "SELECT id, title, description, image, tags, href FROM projects ORDER BY sort_order ASC",
    });

    const teamRows = teamResult.rows;
    const projectRows = projectResult.rows;

    const team =
      teamRows.length > 0
        ? teamRows.map((row) => rowToTeamMember(row))
        : defaultContent.team.map((member) => normalizeMember(member));

    const projects =
      projectRows.length > 0
        ? projectRows.map((row) => rowToProject(row))
        : defaultContent.projects.map((project) => normalizeProject(project));

    return {
      copy: await readSiteCopyFromDb(),
      team,
      projects,
    };
  } catch (error) {
    console.error("readContent fallback:", error);
    return defaultContent;
  }
}

export async function writeContent(content: SiteContent): Promise<void> {
  const db = await getDb();

  const statements = [
    {
      sql: "INSERT INTO site_copy (id, data) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data",
      args: [JSON.stringify(content.copy)],
    },
    { sql: "DELETE FROM team_members", args: [] as string[] },
    { sql: "DELETE FROM projects", args: [] as string[] },
  ];

  content.team.forEach((member, index) => {
    const normalized = normalizeMember(member);
    statements.push({
      sql: `INSERT INTO team_members (id, first_name, last_name, role, image, social, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        normalized.id,
        normalized.firstName,
        normalized.lastName,
        JSON.stringify(normalized.role),
        normalized.image,
        JSON.stringify(normalized.social ?? {}),
        String(index),
      ],
    });
  });

  content.projects.forEach((project, index) => {
    const normalized = normalizeProject(project);
    statements.push({
      sql: `INSERT INTO projects (id, title, description, image, tags, href, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        normalized.id,
        JSON.stringify(normalized.title),
        JSON.stringify(normalized.description),
        normalized.image,
        JSON.stringify(normalized.tags),
        normalized.href,
        String(index),
      ],
    });
  });

  await db.batch(statements, "write");
}
