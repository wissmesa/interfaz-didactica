import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const dealId = parseInt(id);

    const rows = await sql`
      SELECT d.*, c.name as contact_name, c.lastname as contact_lastname, c.email as contact_email, c.company as contact_company, c.phone as contact_phone
      FROM deals d LEFT JOIN contacts c ON d.contact_id = c.id
      WHERE d.id = ${dealId}
    `;
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Deal no encontrado' }, { status: 404 });
    }

    const activities = await sql`
      SELECT * FROM deal_activities WHERE deal_id = ${dealId} ORDER BY created_at DESC
    `;

    return NextResponse.json({ deal: rows[0], activities });
  } catch (error) {
    console.error('Error fetching deal:', error);
    return NextResponse.json({ error: 'Error al obtener deal' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const dealId = parseInt(id);
    const body = await request.json();

    const currentRows = await sql`SELECT stage FROM deals WHERE id = ${dealId}`;
    if (currentRows.length === 0) {
      return NextResponse.json({ error: 'Deal no encontrado' }, { status: 404 });
    }
    const currentStage = currentRows[0].stage;

    const { title, contact_id, stage, amount, expected_close_date, notes } = body;

    const rows = await sql`
      UPDATE deals SET
        title = COALESCE(${title || null}, title),
        contact_id = ${contact_id === undefined ? null : contact_id},
        stage = COALESCE(${stage || null}, stage),
        amount = ${amount === undefined ? null : amount},
        expected_close_date = ${expected_close_date === undefined ? null : expected_close_date},
        notes = ${notes ?? null},
        updated_at = now()
      WHERE id = ${dealId}
      RETURNING *
    `;

    if (stage && stage !== currentStage) {
      await sql`
        INSERT INTO deal_activities (deal_id, from_stage, to_stage, note)
        VALUES (${dealId}, ${currentStage}, ${stage}, ${body.stageNote || null})
      `;
    }

    return NextResponse.json({ deal: rows[0] });
  } catch (error) {
    console.error('Error updating deal:', error);
    return NextResponse.json({ error: 'Error al actualizar deal' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const rows = await sql`DELETE FROM deals WHERE id = ${parseInt(id)} RETURNING id`;
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Deal no encontrado' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting deal:', error);
    return NextResponse.json({ error: 'Error al eliminar deal' }, { status: 500 });
  }
}
