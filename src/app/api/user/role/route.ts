// src/app/api/user/role/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    const { role } = await request.json();
    if (role !== 'user' && role !== 'recruiter') return NextResponse.json({ message: 'Invalid role' }, { status: 400 });
    await dbConnect();
    const user = await User.findOneAndUpdate({ email: session.user.email }, { role }, { new: true });
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });
    return NextResponse.json({ message: 'Role updated' }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
