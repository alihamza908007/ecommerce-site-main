import { NextResponse } from 'next/server';
import { clearSessionCookieConfig } from '@/lib/session';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(clearSessionCookieConfig());
  return response;
}
