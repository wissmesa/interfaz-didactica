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
      return NextResponse.json(
        { error: 'Este lead ya fue convertido a contacto' },
        { status: 409 }
      );
    }

    const existing =
      await sql`SELECT id, name, lastname, company FROM contacts WHERE email = ${(lead.email as string).toLowerCase()}`;
    if (existing.length > 0) {
      await sql`UPDATE leads SET converted_to_contact_id = ${existing[0].id}, updated_at = now() WHERE id = ${leadId}`;

      const contact = existing[0];
      await createDealFromLead(contact.id, contact.name, contact.lastname, contact.company, lead.interest);

      return NextResponse.json({
        contact,
        message: 'Lead asociado a contacto existente con el mismo email',
      });
    }

    const contactRows = await sql`
      INSERT INTO contacts (name, lastname, email, company, phone, notes, lead_id)
      VALUES (${lead.name}, ${lead.lastname || null}, ${(lead.email as string).toLowerCase()}, ${lead.company || null}, ${lead.phone || null}, ${lead.message || null}, ${leadId})
      RETURNING *
    `;

    await sql`UPDATE leads SET converted_to_contact_id = ${contactRows[0].id}, status = 'contactado', updated_at = now() WHERE id = ${leadId}`;

    const contact = contactRows[0];
    await createDealFromLead(contact.id, contact.name, contact.lastname, contact.company, lead.interest);

    return NextResponse.json({ contact }, { status: 201 });
  } catch (error) {
    console.error('Error converting lead:', error);
    return NextResponse.json({ error: 'Error al convertir lead' }, { status: 500 });
  }
}

async function createDealFromLead(
  contactId: number,
  name: string,
  lastname: string | null,
  company: string | null,
  interest: string | null
) {
  const fullName = [name, lastname].filter(Boolean).join(' ');
  const title = company
    ? `${company} — ${fullName}`
    : `Deal — ${fullName}`;
  const notes = interest ? `Cursos de interés: ${interest}` : null;

  const rows = await sql`
    INSERT INTO deals (title, contact_id, stage, notes)
    VALUES (${title}, ${contactId}, ${'pendiente'}, ${notes})
    RETURNING *
  `;

  if (rows[0]) {
    await sql`
      INSERT INTO deal_activities (deal_id, from_stage, to_stage, note)
      VALUES (${rows[0].id}, ${null}, ${'pendiente'}, ${'Deal creado automáticamente al convertir lead'})
    `;
  }
}
