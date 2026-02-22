import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const leadId = parseInt(id);

    const leadRows = await sql`SELECT * FROM leads WHERE id = ${leadId}`;
    if (leadRows.length === 0) {
      return NextResponse.json({ error: 'Lead no encontrado' }, { status: 404 });
    }

    const lead = leadRows[0];

    if (lead.converted_to_contact_id) {
      return NextResponse.json({ error: 'Este lead ya fue convertido a contacto' }, { status: 409 });
    }

    const existing = await sql`SELECT id FROM contacts WHERE email = ${(lead.email as string).toLowerCase()}`;
    if (existing.length > 0) {
      await sql`UPDATE leads SET converted_to_contact_id = ${existing[0].id}, updated_at = now() WHERE id = ${leadId}`;
      return NextResponse.json({
        contact: existing[0],
        message: 'Lead asociado a contacto existente con el mismo email',
      });
    }

    const contactRows = await sql`
      INSERT INTO contacts (name, lastname, email, company, phone, notes, lead_id)
      VALUES (${lead.name}, ${lead.lastname || null}, ${(lead.email as string).toLowerCase()}, ${lead.company || null}, ${lead.phone || null}, ${lead.message || null}, ${leadId})
      RETURNING *
    `;

    await sql`UPDATE leads SET converted_to_contact_id = ${contactRows[0].id}, status = 'contactado', updated_at = now() WHERE id = ${leadId}`;

    return NextResponse.json({ contact: contactRows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error converting lead:', error);
    return NextResponse.json({ error: 'Error al convertir lead' }, { status: 500 });
  }
}
