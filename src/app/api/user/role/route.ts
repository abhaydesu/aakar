// src/app/api/user/role/route.ts
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const { role } = await request.json();
    if (role !== 'user' && role !== 'recruiter') return NextResponse.json({ message: 'Invalid role' }, { status: 400 });

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });

    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

    if (user.role) {
      return NextResponse.json({ message: 'Role already set' }, { status: 403 });
    }

    user.role = role;
    await user.save();

    return NextResponse.json({ message: 'Role updated' }, { status: 200 });
  } catch (error) {
    console.error('Error in /api/user/role:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
