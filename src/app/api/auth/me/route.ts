import { NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/session';

export async function GET(request: Request) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json({ success: false, user: null }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    user: {
      id: session.id,
      email: session.email,
      name: session.name,
      role: session.role,
    },
  });
}
