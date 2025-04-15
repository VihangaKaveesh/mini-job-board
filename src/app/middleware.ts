import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '../lib/auth';

export function middleware(request: NextRequest) {
//gets the requested path and checks wehther it starts from admin
  const path = request.nextUrl.pathname;

  //if it does them extracts the token from authorization header
  if (path.startsWith('/admin')) {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
const user = token && verifyToken(token);//verify token

if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

//then extracts the id from ther token
const userId = user.id
  return NextResponse.next();
}
}

//applies to all routes starting with admin
export const config = {
  matcher: ['/admin/:path*'],
};
