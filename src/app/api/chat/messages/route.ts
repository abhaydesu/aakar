import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

type ReqBody = { since?: string };

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body: ReqBody = await request.json().catch(() => ({}));
    const since = body?.since ? new Date(body.since) : new Date(0);

    await dbConnect();

    const messages = await Message.find({
      toUserId: session.user.id,
      createdAt: { $gt: since },
    })
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json(messages, { status: 200 });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('POST /api/chat/messages error', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
