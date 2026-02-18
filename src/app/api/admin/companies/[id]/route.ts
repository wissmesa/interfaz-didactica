import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const rows = await sql`SELECT * FROM partner_companies WHERE id = ${parseInt(id)}`;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Empresa no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ company: rows[0] });
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json({ error: 'Error al obtener empresa' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { name, logoUrl, website, active, sortOrder } = body;

    const rows = await sql`
      UPDATE partner_companies SET
        name = COALESCE(${name || null}, name),
        logo_url = ${logoUrl ?? null},
        website = ${website ?? null},
        active = COALESCE(${active}, active),
        sort_order = COALESCE(${sortOrder}, sort_order)
      WHERE id = ${parseInt(id)}
      RETURNING *
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Empresa no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ company: rows[0] });
  } catch (error) {
    console.error('Error updating company:', error);
    return NextResponse.json({ error: 'Error al actualizar empresa' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const rows = await sql`DELETE FROM partner_companies WHERE id = ${parseInt(id)} RETURNING id`;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Empresa no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting company:', error);
    return NextResponse.json({ error: 'Error al eliminar empresa' }, { status: 500 });
  }
}
