// src/app/api/chat/mark-read/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json().catch(() => ({}));
    const partnerId = String(body.partnerId || '').trim();
    if (!partnerId) {
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
    }
    await dbConnect();
    const result = await Message.updateMany(
      { fromUserId: partnerId, toUserId: session.user.id, read: false },
      { $set: { read: true } }
    );

    const updatedCount =
      typeof (result as any).modifiedCount === 'number'
        ? (result as any).modifiedCount
        : typeof (result as any).nModified === 'number'
        ? (result as any).nModified
        : 0;

    return NextResponse.json({ updatedCount }, { status: 200 });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('POST /api/chat/mark-read error', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
