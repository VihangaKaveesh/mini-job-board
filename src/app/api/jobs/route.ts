
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  const jobs = await prisma.job.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(jobs);
}

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  const user = token && verifyToken(token);

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { title, company, location, jobType, description } = body;

  const job = await prisma.job.create({
    data: {
      title,
      company,
      location,
      jobType,
      description,
      userId: user.id,
      postedBy: user.email,
    }
  });

  return NextResponse.json(job);
}

export async function DELETE(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  const user = token && verifyToken(token);

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await req.json();
  const job = await prisma.job.delete({
    where: { id: Number(id) }
  });

  return NextResponse.json(job);
}
