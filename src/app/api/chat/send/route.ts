import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';
import User from '@/models/User';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

type ReqBody = { toUserId: string; text: string; roomId?: string };

type IUserLean = {
  _id?: unknown;
  name?: string;
  email?: string;
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as Partial<ReqBody>;
    const toUserIdRaw = String(body.toUserId ?? '').trim();
    const text = String(body.text ?? '').trim();

    if (!toUserIdRaw || !text) {
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
    }

    await dbConnect();

    let toUser: IUserLean | null = null;
    if (/^[0-9a-fA-F]{24}$/.test(toUserIdRaw)) {
      toUser = (await User.findById(toUserIdRaw).select('name email').lean()) as IUserLean | null;
    }
    if (!toUser) {
      toUser = (await User.findOne({ slug: toUserIdRaw }).select('name email').lean()) as IUserLean | null;
    }
    if (!toUser && toUserIdRaw.includes('@')) {
      toUser = (await User.findOne({ email: toUserIdRaw }).select('name email').lean()) as IUserLean | null;
    }

    const fromName = session.user?.name ?? session.user?.email ?? 'User';
    const toName = toUser?.name ?? (toUser?.email ? String(toUser.email) : undefined);

    const messageDoc = new Message({
      fromUserId: String(session.user.id),
      toUserId: toUserIdRaw,
      fromName,
      toName,
      text,
      roomId: body.roomId ? String(body.roomId) : undefined,
      createdAt: new Date(),
      read: false,
    });

    await messageDoc.save();

    const result = {
      ok: true,
      messageId: String(messageDoc._id),
      fromUserId: String(messageDoc.fromUserId),
      toUserId: String(messageDoc.toUserId),
      fromName: messageDoc.fromName,
      toName: messageDoc.toName,
      text: messageDoc.text,
      createdAt: messageDoc.createdAt,
    };

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error('POST /api/chat/send error', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
