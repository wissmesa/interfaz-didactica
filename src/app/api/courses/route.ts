import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    let courses;
    if (category) {
      courses = await sql`
        SELECT c.*,
          (SELECT json_agg(cm.modality_slug) FROM course_modalities cm WHERE cm.course_id = c.id) as modality_slugs
        FROM courses c
        WHERE c.active = true AND c.category_slug = ${category}
        ORDER BY c.featured DESC, c.title ASC
      `;
    } else if (featured === 'true') {
      courses = await sql`
        SELECT c.*,
          (SELECT json_agg(cm.modality_slug) FROM course_modalities cm WHERE cm.course_id = c.id) as modality_slugs
        FROM courses c
        WHERE c.active = true AND c.featured = true
        ORDER BY c.title ASC
      `;
    } else {
      courses = await sql`
        SELECT c.*,
          (SELECT json_agg(cm.modality_slug) FROM course_modalities cm WHERE cm.course_id = c.id) as modality_slugs
        FROM courses c
        WHERE c.active = true
        ORDER BY c.featured DESC, c.title ASC
      `;
    }

    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: 'Error al obtener cursos' }, { status: 500 });
  }
}
