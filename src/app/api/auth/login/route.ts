import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { comparePasswords, createToken, getTokenCookieOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña son requeridos' }, { status: 400 });
    }

    const rows = await sql`
      SELECT id, email, password_hash, name
      FROM admin_users
      WHERE email = ${email.trim().toLowerCase()}
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const user = rows[0];
    const validPassword = await comparePasswords(password, user.password_hash);

    if (!validPassword) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const token = await createToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
    });

    const cookieOptions = getTokenCookieOptions(token);
    response.cookies.set(cookieOptions);

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
