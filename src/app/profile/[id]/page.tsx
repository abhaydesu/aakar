import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Credential from '@/models/Credential';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import CopyProfileLinkButton from '../../components/CopyProfileLinkButton';

type Props = { params: { id: string } };

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default async function PublicProfilePage({ params }: Props) {
  await dbConnect();

  const rawId = String(params.id || '').trim();

  let user: {
    _id: unknown;
    name?: string;
    email?: string;
    image?: string;
    role?: string;
    slug?: string;
  } | null = null;

  if (/^[0-9a-fA-F]{24}$/.test(rawId)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    user = (await User.findById(rawId).select('name image email role slug').lean()) as any;
  }

  if (!user) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    user = (await User.findOne({ slug: rawId }).select('name image email role slug').lean()) as any;
  }

  if (!user) {
    const maybeName = rawId.replace(/-/g, ' ');
    const nameRegex = new RegExp(`^${escapeRegExp(maybeName)}$`, 'i');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    user = (await User.findOne({ name: nameRegex }).select('name image email role slug').lean()) as any;
  }

  if (!user && rawId.includes('@')) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    user = (await User.findOne({ email: rawId }).select('name image email role slug').lean()) as any;
  }

  if (!user) return notFound();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const creds = (await Credential.find({ userId: String(user._id) }).sort({ date: -1 }).lean()) as Array<
    {
      _id: unknown;
      title?: string;
      issuer?: string;
      date?: string | Date;
      skills?: string[];
      fileData?: string;
      fileMimeType?: string;
    }
  >;

  return (
    <main className="bg-[#f9f0eb] min-h-screen text-neutral-900 py-12">
      <div className="max-w-5xl mx-auto px-6">
        <section className="bg-white rounded-2xl p-8 shadow-sm flex flex-col md:flex-row gap-6 items-center">
          <div className="w-28 h-28 rounded-full overflow-hidden bg-neutral-100 flex items-center justify-center">
            {user.image ? (
              <Image src={String(user.image)} alt={user.name ?? 'User'} width={112} height={112} className="object-cover" />
            ) : (
              <div className="text-3xl font-bold text-green-800">{(user.name ?? 'U')[0]}</div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900">{user.name}</h1>
            <p className="mt-1 text-sm text-neutral-600">{user.email}</p>
            <div className="mt-3 inline-flex items-center gap-2">
              <span className="text-xs px-3 py-1 rounded-full bg-neutral-100 text-neutral-800">{user.role ?? 'Learner'}</span>
              <CopyProfileLinkButton />
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Credentials</h2>

          {creds.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm text-neutral-600">No credentials published yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {creds.map((c) => (
                <article key={String(c._id)} className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-neutral-900">{c.title}</h3>
                      <div className="text-sm text-neutral-600 mt-1">{c.issuer}</div>
                      <div className="text-xs text-neutral-500 mt-2">Date: {c.date ? new Date(c.date).toLocaleDateString() : '—'}</div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(c.skills || []).map((s) => (
                          <span key={s} className="text-xs bg-neutral-100 text-neutral-800 px-2 py-1 rounded-full">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {c.fileData ? (
                        <a
                          href={`data:${c.fileMimeType};base64,${c.fileData}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={`certificate-${String(c.title ?? 'cert').replace(/\s+/g, '_')}`}
                          className="inline-flex items-center text-sm px-3 py-2 rounded-md bg-green-800 text-white"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-sm text-neutral-500">No file</span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-10 bg-white rounded-2xl p-6 shadow-sm text-neutral-700">
          <h3 className="font-semibold mb-2">About Aakar</h3>
          <p className="text-sm">
            Aakar aggregates micro-credentials so learners can collect, verify and showcase short-term learning achievements.
            Visit Aakar to learn more or to request a verified transcript.
          </p>

          <div className="mt-4 flex items-center gap-4">
            <Image src="/logo2.png" width={48} height={48} alt="Aakar" />
            <div className="text-sm">
              <div className="font-semibold">Aakar</div>
              <div className="text-xs text-neutral-500">Micro-credential aggregator</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
