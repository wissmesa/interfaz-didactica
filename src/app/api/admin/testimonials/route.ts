import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const testimonials = await sql`
      SELECT * FROM testimonials ORDER BY sort_order ASC, created_at DESC
    `;
    return NextResponse.json({ testimonials });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ error: 'Error al obtener reseñas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, position, company, content, rating, initials, active, sortOrder } = body;

    if (!name || !content) {
      return NextResponse.json(
        { error: 'Nombre y contenido son requeridos' },
        { status: 400 }
      );
    }

    const rows = await sql`
      INSERT INTO testimonials (name, position, company, content, rating, initials, active, sort_order)
      VALUES (${name}, ${position || null}, ${company || null}, ${content}, ${rating || 5}, ${initials || name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)}, ${active !== false}, ${sortOrder || 0})
      RETURNING *
    `;

    return NextResponse.json({ testimonial: rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json({ error: 'Error al crear reseña' }, { status: 500 });
  }
}
