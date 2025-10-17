import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { UpdateResult } from 'mongodb';

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
    const result: UpdateResult = await Message.updateMany(
      { fromUserId: partnerId, toUserId: session.user.id, read: false },
      { $set: { read: true } }
    );

    const updatedCount = typeof result.modifiedCount === 'number' ? result.modifiedCount : 0;

    return NextResponse.json({ updatedCount }, { status: 200 });
  } catch (err) {
    console.error('POST /api/chat/mark-read error', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
