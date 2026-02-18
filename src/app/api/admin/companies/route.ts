import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const companies = await sql`
      SELECT * FROM partner_companies ORDER BY sort_order ASC, created_at DESC
    `;
    return NextResponse.json({ companies });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json({ error: 'Error al obtener empresas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, logoUrl, website, active, sortOrder } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'El nombre es requerido' },
        { status: 400 }
      );
    }

    const rows = await sql`
      INSERT INTO partner_companies (name, logo_url, website, active, sort_order)
      VALUES (${name}, ${logoUrl || null}, ${website || null}, ${active !== false}, ${sortOrder || 0})
      RETURNING *
    `;

    return NextResponse.json({ company: rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json({ error: 'Error al crear empresa' }, { status: 500 });
  }
}
