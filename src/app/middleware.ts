// /middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '../lib/auth';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith('/admin')) {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
const user = token && verifyToken(token);

if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

const userId = user.id
  return NextResponse.next();
}
}

export const config = {
  matcher: ['/admin/:path*'],
};
