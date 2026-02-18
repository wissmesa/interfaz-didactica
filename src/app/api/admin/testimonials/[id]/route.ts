import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const rows = await sql`SELECT * FROM testimonials WHERE id = ${parseInt(id)}`;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Reseña no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ testimonial: rows[0] });
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    return NextResponse.json({ error: 'Error al obtener reseña' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { name, position, company, content, rating, initials, active, sortOrder } = body;

    const rows = await sql`
      UPDATE testimonials SET
        name = COALESCE(${name || null}, name),
        position = ${position ?? null},
        company = ${company ?? null},
        content = COALESCE(${content || null}, content),
        rating = COALESCE(${rating}, rating),
        initials = ${initials ?? null},
        active = COALESCE(${active}, active),
        sort_order = COALESCE(${sortOrder}, sort_order),
        updated_at = now()
      WHERE id = ${parseInt(id)}
      RETURNING *
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Reseña no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ testimonial: rows[0] });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json({ error: 'Error al actualizar reseña' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const rows = await sql`DELETE FROM testimonials WHERE id = ${parseInt(id)} RETURNING id`;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Reseña no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json({ error: 'Error al eliminar reseña' }, { status: 500 });
  }
}
