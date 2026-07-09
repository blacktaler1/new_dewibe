import { getDb, rowToLead } from "./db";
import type { Lead } from "./types";

export async function readLeads(): Promise<Lead[]> {
  const rows = getDb()
    .prepare(
      "SELECT id, name, email, message, created_at, read FROM leads ORDER BY created_at DESC",
    )
    .all() as {
    id: string;
    name: string;
    email: string;
    message: string;
    created_at: string;
    read: number;
  }[];

  return rows.map(rowToLead);
}

export async function writeLeads(leads: Lead[]): Promise<void> {
  const db = getDb();

  const save = db.transaction(() => {
    db.prepare("DELETE FROM leads").run();
    const insert = db.prepare(`
      INSERT INTO leads (id, name, email, message, created_at, read)
      VALUES (@id, @name, @email, @message, @createdAt, @read)
    `);

    for (const lead of leads) {
      insert.run({
        id: lead.id,
        name: lead.name,
        email: lead.email,
        message: lead.message,
        createdAt: lead.createdAt,
        read: lead.read ? 1 : 0,
      });
    }
  });

  save();
}

export async function addLead(
  lead: Omit<Lead, "id" | "createdAt" | "read">,
): Promise<Lead> {
  const newLead: Lead = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    ...lead,
    createdAt: new Date().toISOString(),
    read: false,
  };

  getDb()
    .prepare(
      "INSERT INTO leads (id, name, email, message, created_at, read) VALUES (?, ?, ?, ?, ?, 0)",
    )
    .run(
      newLead.id,
      newLead.name,
      newLead.email,
      newLead.message,
      newLead.createdAt,
    );

  return newLead;
}
