
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, comparePassword, signToken } from '@/lib/auth';

//hence i differenciate the logi and the signup from the tyope , both should accept POST requests
export async function POST(req: Request) {
    //passes a JSON body
  const body = await req.json();
  const { name, 
    email, 
    password, 
    type } = body;

//if the type equals to signup itlle be taken as a register 
  if (type === 'signup') {
    //checks whther the email is unique
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: 'User already exists' }, { status: 400 });

    //hashing the password
    const hashed = await hashPassword(password);

    //then we create a new user in the database
    const user = await prisma.user.create({
      data: { name, 
        email, 
        password: hashed }
    });

    //creates and returns a JWT token for authentication
    const token = signToken({ id: user.id, email: user.email });
    return NextResponse.json({ token });
  }


  //if the type equals to login 
  if (type === 'login') {

    //finds the user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    //compares the entered password with stored hased password
    const isValid = await comparePassword(password, user.password);
    if (!isValid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    //returns a token on success
    const token = signToken({ id: user.id, email: user.email });
    return NextResponse.json({ token });
  }

  return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
}
