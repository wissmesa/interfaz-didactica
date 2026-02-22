import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const rows = await sql`SELECT * FROM contacts WHERE id = ${parseInt(id)}`;
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Contacto no encontrado' }, { status: 404 });
    }

    const deals = await sql`
      SELECT id, title, stage, amount, expected_close_date, created_at
      FROM deals WHERE contact_id = ${parseInt(id)} ORDER BY created_at DESC
    `;

    return NextResponse.json({ contact: rows[0], deals });
  } catch (error) {
    console.error('Error fetching contact:', error);
    return NextResponse.json({ error: 'Error al obtener contacto' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { name, lastname, email, company, phone, position, notes } = body;

    const rows = await sql`
      UPDATE contacts SET
        name = COALESCE(${name || null}, name),
        lastname = ${lastname ?? null},
        email = COALESCE(${email?.toLowerCase() || null}, email),
        company = ${company ?? null},
        phone = ${phone ?? null},
        position = ${position ?? null},
        notes = ${notes ?? null},
        updated_at = now()
      WHERE id = ${parseInt(id)}
      RETURNING *
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Contacto no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ contact: rows[0] });
  } catch (error: unknown) {
    const pgError = error as { code?: string };
    if (pgError.code === '23505') {
      return NextResponse.json({ error: 'Ya existe un contacto con ese email' }, { status: 409 });
    }
    console.error('Error updating contact:', error);
    return NextResponse.json({ error: 'Error al actualizar contacto' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const rows = await sql`DELETE FROM contacts WHERE id = ${parseInt(id)} RETURNING id`;
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Contacto no encontrado' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json({ error: 'Error al eliminar contacto' }, { status: 500 });
  }
}
