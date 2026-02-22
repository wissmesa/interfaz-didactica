import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const leadId = parseInt(id);

    const rows = await sql`SELECT * FROM leads WHERE id = ${leadId}`;
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Lead no encontrado' }, { status: 404 });
    }

    const activities = await sql`
      SELECT * FROM lead_activities WHERE lead_id = ${leadId} ORDER BY created_at DESC
    `;

    return NextResponse.json({ lead: rows[0], activities });
  } catch (error) {
    console.error('Error fetching lead:', error);
    return NextResponse.json({ error: 'Error al obtener lead' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const leadId = parseInt(id);
    const body = await request.json();

    const currentRows = await sql`SELECT status FROM leads WHERE id = ${leadId}`;
    if (currentRows.length === 0) {
      return NextResponse.json({ error: 'Lead no encontrado' }, { status: 404 });
    }
    const currentStatus = currentRows[0].status;

    const { name, lastname, email, company, phone, interest, message, notes, status, source } =
      body;

    const rows = await sql`
      UPDATE leads SET
        name = COALESCE(${name || null}, name),
        lastname = ${lastname ?? null},
        email = COALESCE(${email || null}, email),
        company = ${company ?? null},
        phone = ${phone ?? null},
        interest = ${interest ?? null},
        message = ${message ?? null},
        notes = ${notes ?? null},
        status = COALESCE(${status || null}, status),
        source = COALESCE(${source || null}, source),
        updated_at = now()
      WHERE id = ${leadId}
      RETURNING *
    `;

    if (status && status !== currentStatus) {
      await sql`
        INSERT INTO lead_activities (lead_id, from_status, to_status, note)
        VALUES (${leadId}, ${currentStatus}, ${status}, ${body.statusNote || null})
      `;
    }

    return NextResponse.json({ lead: rows[0] });
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ error: 'Error al actualizar lead' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const leadId = parseInt(id);

    const rows = await sql`DELETE FROM leads WHERE id = ${leadId} RETURNING id`;
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Lead no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json({ error: 'Error al eliminar lead' }, { status: 500 });
  }
}
