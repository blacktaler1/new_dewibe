import { getDb, rowToLead } from "./db";
import type { Lead } from "./types";

export async function readLeads(): Promise<Lead[]> {
  const db = await getDb();
  const result = await db.execute({
    sql: "SELECT id, name, email, message, created_at, read FROM leads ORDER BY created_at DESC",
  });

  return result.rows.map((row) => rowToLead(row));
}

export async function writeLeads(leads: Lead[]): Promise<void> {
  const db = await getDb();
  const statements = [{ sql: "DELETE FROM leads", args: [] as string[] }];

  for (const lead of leads) {
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

  await db.batch(statements, "write");
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

  const db = await getDb();
  await db.execute({
    sql: "INSERT INTO leads (id, name, email, message, created_at, read) VALUES (?, ?, ?, ?, ?, 0)",
    args: [
      newLead.id,
      newLead.name,
      newLead.email,
      newLead.message,
      newLead.createdAt,
    ],
  });

  return newLead;
}
