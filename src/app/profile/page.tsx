'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type SessionWithSlug = { user?: { slug?: string } } | null;

export default function MyProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [slug, setSlug] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      const s = session as unknown as SessionWithSlug;
      setSlug(s?.user?.slug ?? '');
    }
  }, [status, session]);

  const handleSave = async () => {
    if (!slug || slug.length < 3) {
      toast.error('Choose a slug (min 3 chars).');
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch('/api/user/slug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
        credentials: 'include',
      });
      if (res.ok) {
        toast.success('Profile id saved!');
        try {
          await update({ ...session, user: { ...session?.user, slug } });
        } catch {}
        router.push('/dashboard');
      } else {
        const txt = await res.text().catch(() => '');
        if (res.status === 403) {
          toast.error('You already set a userid once and cannot change it.');
        } else if (res.status === 409) {
          toast.error('This userid is already taken.');
        } else {
          console.error('Save slug failed:', res.status, txt);
          toast.error('Failed to save. Check console.');
        }
      }
    } catch (err) {
      console.error('Network error saving slug:', err);
      toast.error('Network error.');
    } finally {
      setIsSaving(false);
    }
  };

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (status !== 'authenticated' || !session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <div className="text-lg font-semibold mb-2">Not signed in</div>
          <a href="/signin" className="inline-block mt-2 px-4 py-2 rounded-md bg-neutral-900 text-white">Sign In</a>
        </div>
      </div>
    );
  }

  const user = session.user as unknown as { name?: string; email?: string; image?: string; role?: string; slug?: string };

  return (
    <main className="min-h-screen bg-[#f9f0eb] p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 shadow">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-neutral-100 flex items-center justify-center">
            {user.image ? <Image src={user.image} alt={user.name ?? 'User'} width={80} height={80} /> : <div className="text-2xl font-bold text-green-800">{(user.name ?? 'U')[0]}</div>}
          </div>
          <div>
            <div className="text-xl text-neutral-900">{user.name}</div>
            <div className="text-sm text-neutral-600">{user.email}</div>
            <div className="text-xs text-neutral-500 mt-1">{user.role ?? 'Learner'}</div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 text-black">Public profile id (one-time)</h3>
          {user.slug ? (
            <div className="flex items-center gap-3">
              <div className="px-3 py-2 rounded-md bg-neutral-100 text-sm">/profile/{user.slug}</div>
              <button
                onClick={() => {
                  if (typeof navigator !== 'undefined' && navigator.clipboard) void navigator.clipboard.writeText(`${location.origin}/profile/${user.slug}`);
                }}
                className="px-3 py-2 rounded-md bg-neutral-900 text-white"
              >
                Copy link
              </button>
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value.trim().toLowerCase())}
                placeholder="choose-a-unique-id"
                className="p-2 rounded-md border border-neutral-200 bg-[#f3efe8]"
              />
              <button onClick={handleSave} disabled={isSaving} className="px-3 py-2 rounded-md bg-green-800 text-white">
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
          <div className="text-xs text-neutral-500 mt-2">Once set you cannot change this id. Allowed: lowercase letters, numbers and hyphens.</div>
        </div>
      </div>
    </main>
  );
}
