// /app/api/auth/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, comparePassword, signToken } from '@/lib/auth';

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, password, type } = body;

  if (type === 'signup') {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: 'User already exists' }, { status: 400 });

    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, email, password: hashed }
    });

    const token = signToken({ id: user.id, email: user.email });
    return NextResponse.json({ token });
  }

  if (type === 'login') {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const isValid = await comparePassword(password, user.password);
    if (!isValid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const token = signToken({ id: user.id, email: user.email });
    return NextResponse.json({ token });
  }

  return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
}
