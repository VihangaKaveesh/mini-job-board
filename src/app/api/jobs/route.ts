import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

//since the job viewing part is public no need of authentications
export async function GET() {
    //fetches all o fthe jobs and orderBy the created date descendingly
  const jobs = await prisma.job.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(jobs);
}

//adding a job 
export async function POST(req: NextRequest) {

    //extracts the jwt token from the header
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  const user = token && verifyToken(token);

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  //passes job data as a JSON
  const body = await req.json();
  const { title, 
    company, 
    location, 
    jobType, 
    description } = body;

    //created a new job in the database
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


//deleting a job
export async function DELETE(req: NextRequest) {

    //extracts the jwt token from the header
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  const user = token && verifyToken(token);

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  //gets the job id by the body
  const { id } = await req.json();
  const job = await prisma.job.delete({
    where: { id: Number(id) }
  });

  return NextResponse.json(job);
}
