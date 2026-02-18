import { NextResponse } from 'next/server';
import { getLogoutCookieOptions } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json({ success: true });
  const cookieOptions = getLogoutCookieOptions();
  response.cookies.set(cookieOptions);
  return response;
}
