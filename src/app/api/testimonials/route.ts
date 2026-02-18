import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const testimonials = await sql`
      SELECT * FROM testimonials
      WHERE active = true
      ORDER BY sort_order ASC, created_at DESC
    `;
    return NextResponse.json({ testimonials });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ error: 'Error al obtener reseñas' }, { status: 500 });
  }
}
