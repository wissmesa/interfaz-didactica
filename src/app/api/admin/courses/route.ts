import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    const courses = await sql`
      SELECT c.*, 
        (SELECT json_agg(cm.modality_slug) FROM course_modalities cm WHERE cm.course_id = c.id) as modality_slugs
      FROM courses c
      ORDER BY c.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countResult = await sql`SELECT COUNT(*) as total FROM courses`;
    const total = parseInt(countResult[0].total);

    return NextResponse.json({ courses, total, page, limit });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: 'Error al obtener cursos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
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
    } = body;

    if (!slug || !title) {
      return NextResponse.json(
        { error: 'Slug y título son requeridos' },
        { status: 400 }
      );
    }

    const rows = await sql`
      INSERT INTO courses (slug, title, excerpt, description, hours, requirements, audience, image, category_slug, featured)
      VALUES (${slug}, ${title}, ${excerpt || null}, ${description || null}, ${hours || null}, ${requirements || null}, ${audience || null}, ${image || null}, ${categorySlug || null}, ${featured || false})
      RETURNING *
    `;

    const course = rows[0];

    if (modalitySlugs && Array.isArray(modalitySlugs)) {
      for (const modSlug of modalitySlugs) {
        await sql`
          INSERT INTO course_modalities (course_id, modality_slug)
          VALUES (${course.id}, ${modSlug})
          ON CONFLICT DO NOTHING
        `;
      }
    }

    return NextResponse.json({ course }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating course:', error);
    const pgError = error as { code?: string };
    if (pgError.code === '23505') {
      return NextResponse.json(
        { error: 'Ya existe un curso con ese slug' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: 'Error al crear curso' }, { status: 500 });
  }
}
