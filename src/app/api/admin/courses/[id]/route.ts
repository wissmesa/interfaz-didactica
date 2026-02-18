import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const rows = await sql`
      SELECT c.*,
        (SELECT json_agg(cm.modality_slug) FROM course_modalities cm WHERE cm.course_id = c.id) as modality_slugs
      FROM courses c WHERE c.id = ${parseInt(id)}
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ course: rows[0] });
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json({ error: 'Error al obtener curso' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const {
      slug,
      title,
      excerpt,
      description,
      hours,
      requirements,
      audience,
      image,
      categorySlug,
      modalitySlugs,
      featured,
      active,
    } = body;

    const rows = await sql`
      UPDATE courses SET
        slug = COALESCE(${slug || null}, slug),
        title = COALESCE(${title || null}, title),
        excerpt = ${excerpt ?? null},
        description = ${description ?? null},
        hours = ${hours ?? null},
        requirements = ${requirements ?? null},
        audience = ${audience ?? null},
        image = ${image ?? null},
        category_slug = ${categorySlug ?? null},
        featured = COALESCE(${featured}, featured),
        active = COALESCE(${active}, active),
        updated_at = now()
      WHERE id = ${parseInt(id)}
      RETURNING *
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    if (modalitySlugs && Array.isArray(modalitySlugs)) {
      await sql`DELETE FROM course_modalities WHERE course_id = ${parseInt(id)}`;
      for (const modSlug of modalitySlugs) {
        await sql`
          INSERT INTO course_modalities (course_id, modality_slug)
          VALUES (${parseInt(id)}, ${modSlug})
          ON CONFLICT DO NOTHING
        `;
      }
    }

    return NextResponse.json({ course: rows[0] });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json({ error: 'Error al actualizar curso' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const rows = await sql`
      DELETE FROM courses WHERE id = ${parseInt(id)} RETURNING id
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json({ error: 'Error al eliminar curso' }, { status: 500 });
  }
}
