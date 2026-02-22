import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const source = searchParams.get('source');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '200');
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: unknown[] = [];

    if (status) {
      conditions.push(`status = $${params.length + 1}`);
      params.push(status);
    }
    if (source) {
      conditions.push(`source = $${params.length + 1}`);
      params.push(source);
    }
    if (search) {
      conditions.push(
        `(name ILIKE $${params.length + 1} OR email ILIKE $${params.length + 1} OR company ILIKE $${params.length + 1})`
      );
      params.push(`%${search}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const leads = await sql.query(
      `SELECT * FROM leads ${whereClause} ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );

    const countResult = await sql.query(
      `SELECT COUNT(*)::int as total FROM leads ${whereClause}`,
      params
    );

    const total = countResult[0].total;

    const stageCounts = await sql`
      SELECT status, COUNT(*)::int as count FROM leads GROUP BY status
    `;

    return NextResponse.json({
      leads,
      total,
      page,
      limit,
      stageCounts: Object.fromEntries(
        stageCounts.map((r: Record<string, unknown>) => [r.status, r.count])
      ),
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Error al obtener leads' }, { status: 500 });
  }
}
