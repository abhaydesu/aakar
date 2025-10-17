import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/mongodb';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import User from '@/models/User';
import Credential from '@/models/Credential';

type ResultItem = {
  id: string;
  name: string;
  email: string;
  image?: string;
  role?: string | undefined;
  matchCount: number;
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const techs = Array.isArray(body.techs) ? body.techs.map((t: string) => String(t).toLowerCase()) : [];
    const limit = typeof body.limit === 'number' ? body.limit : 50;

    if (techs.length === 0) {
      return NextResponse.json({ message: 'No techs provided' }, { status: 400 });
    }

    await dbConnect();

    const users = await User.find({ _id: { $ne: session.user.id } })
      .select('_id name email image role')
      .lean();

    const results: ResultItem[] = [];

    for (const user of users) {
      const creds = await Credential.find({ userId: user._id }).select('skills').lean();
      const userTechs = new Set<string>();
      for (const cred of creds) {
        const skills = cred.skills || [];
        for (const s of skills) userTechs.add(String(s).toLowerCase());
      }

      const matchCount = techs.reduce((acc: number, t: string) => (userTechs.has(t) ? acc + 1 : acc), 0);
      if (matchCount > 0) {
        results.push({
          id: String(user._id),
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          matchCount,
        });
      }
    }

    results.sort((a, b) => b.matchCount - a.matchCount);

    return NextResponse.json(results.slice(0, limit), { status: 200 });
  } catch (err) {
    console.error('POST /api/search/users error', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
