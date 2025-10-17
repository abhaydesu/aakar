import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

type ReqBody = { toUserId: string; text: string; roomId?: string };

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body: ReqBody = await request.json().catch(() => ({} as ReqBody));
    const toUserId = String(body.toUserId || '').trim();
    const text = String(body.text || '').trim();

    if (!toUserId || !text) {
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
    }

    await dbConnect();

    const message = new Message({
      fromUserId: session.user.id,
      toUserId,
      text,
      roomId: body.roomId ? String(body.roomId) : undefined,
      createdAt: new Date(),
      read: false,
    });

    await message.save();

    return NextResponse.json({ ok: true, messageId: String(message._id) }, { status: 201 });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('POST /api/chat/send error', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
