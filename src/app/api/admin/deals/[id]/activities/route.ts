import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const dealId = parseInt(id);
    const body = await request.json();

    const dealRows = await sql`SELECT id, stage FROM deals WHERE id = ${dealId}`;
    if (dealRows.length === 0) {
      return NextResponse.json({ error: 'Deal no encontrado' }, { status: 404 });
    }

    const currentStage = dealRows[0].stage;

    const rows = await sql`
      INSERT INTO deal_activities (deal_id, from_stage, to_stage, note)
      VALUES (${dealId}, ${currentStage}, ${currentStage}, ${body.note || ''})
      RETURNING *
    `;

    return NextResponse.json({ activity: rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating deal activity:', error);
    return NextResponse.json({ error: 'Error al crear actividad' }, { status: 500 });
  }
}
