import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const companies = await sql`
      SELECT * FROM partner_companies
      WHERE active = true
      ORDER BY sort_order ASC, created_at DESC
    `;
    return NextResponse.json({ companies });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json({ error: 'Error al obtener empresas' }, { status: 500 });
  }
}
