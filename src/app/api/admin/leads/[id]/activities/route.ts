import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const leadId = parseInt(id);
    const body = await request.json();

    const leadRows = await sql`SELECT id, status FROM leads WHERE id = ${leadId}`;
    if (leadRows.length === 0) {
      return NextResponse.json({ error: 'Lead no encontrado' }, { status: 404 });
    }

    const currentStatus = leadRows[0].status;

    const rows = await sql`
      INSERT INTO lead_activities (lead_id, from_status, to_status, note)
      VALUES (${leadId}, ${currentStatus}, ${currentStatus}, ${body.note || ''})
      RETURNING *
    `;

    return NextResponse.json({ activity: rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json(
      { error: 'Error al crear actividad' },
      { status: 500 }
    );
  }
}
