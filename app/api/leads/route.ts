import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { addLead, readLeads, writeLeads } from "@/lib/leads-file";
export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const leads = await readLeads();
  return NextResponse.json(leads);
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    email?: string;
    message?: string;
  };

  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const lead = await addLead({ name, email, message });
  return NextResponse.json({ success: true, lead });
}

export async function PATCH(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { id?: string; read?: boolean };
  if (!body.id) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const leads = await readLeads();
  const updated = leads.map((lead) =>
    lead.id === body.id ? { ...lead, read: body.read ?? true } : lead,
  );
  await writeLeads(updated);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const leads = await readLeads();
  await writeLeads(leads.filter((lead) => lead.id !== id));
  return NextResponse.json({ success: true });
}
