import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// Fetching all jobs by giving the option to filter 
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  
  // Get the filter parameters from query string
  const location = searchParams.get('location') || '';
  const jobType = searchParams.get('jobType') || '';
  const skip = parseInt(searchParams.get('skip') || '0', 10); // Default to 0
  const take = parseInt(searchParams.get('take') || '10', 10); // Default to 10

  //filtering conditions
  const filterConditions: any = {
    orderBy: { createdAt: 'desc' },
    skip: skip,
    take: take,
  };

  // Add filters
  if (location) {
    filterConditions.where = { 
      ...filterConditions.where,
      location: { contains: location, mode: 'insensitive' },
    };
  }

  if (jobType) {
    filterConditions.where = { 
      ...filterConditions.where,
      jobType: { equals: jobType },
    };
  }

  try {
    const jobs = await prisma.job.findMany(filterConditions);
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

// Adding a job
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
    },
  });

  return NextResponse.json(job);
}

// Deleting a job
export async function DELETE(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  const user = token && verifyToken(token);

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await req.json();
  const job = await prisma.job.delete({
    where: { id: Number(id) },
  });

  return NextResponse.json(job);
}
