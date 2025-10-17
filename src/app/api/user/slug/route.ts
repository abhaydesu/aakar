import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

function validateSlug(s: string) {
  if (!s) return false;
  const trimmed = s.trim().toLowerCase();
  if (trimmed.length < 3 || trimmed.length > 30) return false;
  return /^[a-z0-9\-]+$/.test(trimmed);
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({} as { slug?: string }));
    const raw = String(body?.slug ?? '').trim().toLowerCase();

    if (!validateSlug(raw)) {
      return NextResponse.json({ message: 'Invalid slug. Use lowercase letters, numbers and hyphens (3-30 chars).' }, { status: 400 });
    }

    await dbConnect();

    const dbUser = await User.findById(session.user.id).select('slug').lean();
    if (!dbUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if ((dbUser as any).slug) {
      return NextResponse.json({ message: 'Slug already set' }, { status: 403 });
    }

    const exists = await User.findOne({ slug: raw }).lean();
    if (exists) {
      return NextResponse.json({ message: 'Slug already taken' }, { status: 409 });
    }

    await User.findByIdAndUpdate(session.user.id, { slug: raw });
    return NextResponse.json({ message: 'Slug saved', slug: raw }, { status: 200 });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('POST /api/user/slug error', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
