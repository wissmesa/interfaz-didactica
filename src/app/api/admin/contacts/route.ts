import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = (page - 1) * limit;

    let contacts;
    let total;

    if (search) {
      const pattern = `%${search}%`;
      contacts = await sql`
        SELECT * FROM contacts
        WHERE name ILIKE ${pattern} OR lastname ILIKE ${pattern} OR email ILIKE ${pattern} OR company ILIKE ${pattern}
        ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
      `;
      const [countRow] = await sql`
        SELECT COUNT(*)::int as total FROM contacts
        WHERE name ILIKE ${pattern} OR lastname ILIKE ${pattern} OR email ILIKE ${pattern} OR company ILIKE ${pattern}
      `;
      total = countRow.total;
    } else {
      contacts = await sql`
        SELECT * FROM contacts ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
      `;
      const [countRow] = await sql`SELECT COUNT(*)::int as total FROM contacts`;
      total = countRow.total;
    }

    return NextResponse.json({ contacts, total, page, limit });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ error: 'Error al obtener contactos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, lastname, email, company, phone, position, notes } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Nombre y email son requeridos' }, { status: 400 });
    }

    const rows = await sql`
      INSERT INTO contacts (name, lastname, email, company, phone, position, notes)
      VALUES (${name}, ${lastname || null}, ${email.toLowerCase()}, ${company || null}, ${phone || null}, ${position || null}, ${notes || null})
      RETURNING *
    `;

    return NextResponse.json({ contact: rows[0] }, { status: 201 });
  } catch (error: unknown) {
    const pgError = error as { code?: string };
    if (pgError.code === '23505') {
      return NextResponse.json({ error: 'Ya existe un contacto con ese email' }, { status: 409 });
    }
    console.error('Error creating contact:', error);
    return NextResponse.json({ error: 'Error al crear contacto' }, { status: 500 });
  }
}
