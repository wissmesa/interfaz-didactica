import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const stage = searchParams.get('stage');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '500');

    let deals;
    if (stage && search) {
      const pattern = `%${search}%`;
      deals = await sql`
        SELECT d.*, c.name as contact_name, c.lastname as contact_lastname, c.email as contact_email, c.company as contact_company
        FROM deals d LEFT JOIN contacts c ON d.contact_id = c.id
        WHERE d.stage = ${stage} AND (d.title ILIKE ${pattern} OR c.name ILIKE ${pattern} OR c.company ILIKE ${pattern})
        ORDER BY d.created_at DESC LIMIT ${limit}
      `;
    } else if (stage) {
      deals = await sql`
        SELECT d.*, c.name as contact_name, c.lastname as contact_lastname, c.email as contact_email, c.company as contact_company
        FROM deals d LEFT JOIN contacts c ON d.contact_id = c.id
        WHERE d.stage = ${stage}
        ORDER BY d.created_at DESC LIMIT ${limit}
      `;
    } else if (search) {
      const pattern = `%${search}%`;
      deals = await sql`
        SELECT d.*, c.name as contact_name, c.lastname as contact_lastname, c.email as contact_email, c.company as contact_company
        FROM deals d LEFT JOIN contacts c ON d.contact_id = c.id
        WHERE d.title ILIKE ${pattern} OR c.name ILIKE ${pattern} OR c.company ILIKE ${pattern}
        ORDER BY d.created_at DESC LIMIT ${limit}
      `;
    } else {
      deals = await sql`
        SELECT d.*, c.name as contact_name, c.lastname as contact_lastname, c.email as contact_email, c.company as contact_company
        FROM deals d LEFT JOIN contacts c ON d.contact_id = c.id
        ORDER BY d.created_at DESC LIMIT ${limit}
      `;
    }

    const stageCounts = await sql`
      SELECT stage, COUNT(*)::int as count FROM deals GROUP BY stage
    `;

    return NextResponse.json({
      deals,
      stageCounts: Object.fromEntries(
        stageCounts.map((r: Record<string, unknown>) => [r.stage, r.count])
      ),
    });
  } catch (error) {
    console.error('Error fetching deals:', error);
    return NextResponse.json({ error: 'Error al obtener deals' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, contact_id, stage, amount, expected_close_date, notes } = body;

    if (!title) {
      return NextResponse.json({ error: 'El título es requerido' }, { status: 400 });
    }

    const rows = await sql`
      INSERT INTO deals (title, contact_id, stage, amount, expected_close_date, notes)
      VALUES (${title}, ${contact_id || null}, ${stage || 'pendiente'}, ${amount || null}, ${expected_close_date || null}, ${notes || null})
      RETURNING *
    `;

    if (rows[0]) {
      await sql`
        INSERT INTO deal_activities (deal_id, from_stage, to_stage, note)
        VALUES (${rows[0].id}, ${null}, ${rows[0].stage}, ${'Deal creado'})
      `;
    }

    return NextResponse.json({ deal: rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating deal:', error);
    return NextResponse.json({ error: 'Error al crear deal' }, { status: 500 });
  }
}
