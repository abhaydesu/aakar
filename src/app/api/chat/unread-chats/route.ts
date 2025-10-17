import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ count: 0 }, { status: 200 });
    }
    await dbConnect();
    const distinct = await Message.distinct('fromUserId', { toUserId: session.user.id, read: false });
    const count = Array.isArray(distinct) ? distinct.length : 0;
    return NextResponse.json({ count }, { status: 200 });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('GET /api/chat/unread-chats error', err);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
