import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { sendLeadNotification } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.email) {
      return NextResponse.json(
        { success: false, error: 'Nombre y email son campos requeridos' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Por favor ingresa un email válido' },
        { status: 400 }
      );
    }

    const name = body.name.trim();
    const lastname = body.lastname?.trim() || null;
    const email = body.email.trim().toLowerCase();
    const company = body.company?.trim() || null;
    const phone = body.phone?.trim() || null;
    const interest = body.interest || null;
    const message = body.message?.trim() || null;
    const source = body.source || 'hero-form';

    // 1. Crear lead
    const rows = await sql`
      INSERT INTO leads (name, lastname, email, company, phone, interest, message, source, status)
      VALUES (${name}, ${lastname}, ${email}, ${company}, ${phone}, ${interest}, ${message}, ${source}, 'contactado')
      RETURNING id, name, email, source
    `;
    const savedLead = rows[0];

    // 2. Crear o reusar contacto
    let contactId: number;
    const existingContact = await sql`SELECT id FROM contacts WHERE email = ${email}`;
    if (existingContact.length > 0) {
      contactId = existingContact[0].id;
    } else {
      const contactRows = await sql`
        INSERT INTO contacts (name, lastname, email, company, phone, notes, lead_id)
        VALUES (${name}, ${lastname}, ${email}, ${company}, ${phone}, ${message}, ${savedLead.id})
        RETURNING id
      `;
      contactId = contactRows[0].id;
    }

    // 3. Vincular lead al contacto
    await sql`UPDATE leads SET converted_to_contact_id = ${contactId}, updated_at = now() WHERE id = ${savedLead.id}`;

    // 4. Crear deal en stage pendiente
    const fullName = [name, lastname].filter(Boolean).join(' ');
    const dealTitle = company ? `${company} — ${fullName}` : `Deal — ${fullName}`;
    const dealNotes = interest ? `Cursos de interés: ${interest}` : null;

    const dealRows = await sql`
      INSERT INTO deals (title, contact_id, stage, notes)
      VALUES (${dealTitle}, ${contactId}, ${'pendiente'}, ${dealNotes})
      RETURNING id
    `;
    if (dealRows[0]) {
      await sql`
        INSERT INTO deal_activities (deal_id, from_stage, to_stage, note)
        VALUES (${dealRows[0].id}, ${null}, ${'pendiente'}, ${'Deal creado automáticamente desde formulario web'})
      `;
    }

    // 5. Enviar notificación por email (no bloqueante)
    sendLeadNotification({ name, lastname, email, phone, company, interest, message, source });

    return NextResponse.json(
      {
        success: true,
        message: 'Lead guardado exitosamente',
        leadId: savedLead.id,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Error al guardar lead:', error);

    const pgError = error as { code?: string };

    if (pgError.code === '23505') {
      return NextResponse.json(
        { success: false, error: 'Ya existe un lead con este email desde esta fuente' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const offset = (page - 1) * limit;

    let leads;
    let countResult;

    if (status) {
      leads = await sql`
        SELECT id, name, lastname, email, company, phone, interest, message, source, status, created_at, updated_at
        FROM leads
        WHERE status = ${status}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      countResult = await sql`
        SELECT COUNT(*)::int as total FROM leads WHERE status = ${status}
      `;
    } else {
      leads = await sql`
        SELECT id, name, lastname, email, company, phone, interest, message, source, status, created_at, updated_at
        FROM leads
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      countResult = await sql`SELECT COUNT(*)::int as total FROM leads`;
    }

    const total = countResult[0].total;

    return NextResponse.json({
      success: true,
      leads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error al obtener leads:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
