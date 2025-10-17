'use client';
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Link as LinkIcon } from 'lucide-react';

type SessionWithSlug = { user?: { slug?: string } } | null;

export default function MyProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [slug, setSlug] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingSlug, setIsLoadingSlug] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      const s = session as unknown as SessionWithSlug;
      setSlug(s?.user?.slug ?? '');
    }
  }, [status, session]);

  // Fetch latest slug from server (in case session doesn't include it)
  useEffect(() => {
    let mounted = true;
    const fetchSlug = async () => {
      if (status !== 'authenticated') return;
      setIsLoadingSlug(true);
      try {
        const res = await fetch('/api/user/slug');
        if (res.ok) {
          const data = await res.json().catch(() => ({} as { slug?: string | null }));
          if (mounted && data?.slug) setSlug(String(data.slug));
        }
      } catch (err) {
        // ignore - optional fetch
        console.error('Failed to fetch slug:', err);
      } finally {
        if (mounted) setIsLoadingSlug(false);
      }
    };
    fetchSlug();
    return () => {
      mounted = false;
    };
  }, [status]);

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
            <div className="flex items-center gap-3">
              <div className="text-xl text-neutral-900">{user.name}</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const idToCopy = user.slug ?? slug;
                    if (!idToCopy) return;
                    if (typeof navigator !== 'undefined' && navigator.clipboard) {
                      void navigator.clipboard.writeText(`${location.origin}/profile/${idToCopy}`).then(() => {
                        setCopied(true);
                        toast.success('Public link copied');
                        // clear any previous timeout
                        if (copyTimeoutRef.current) window.clearTimeout(copyTimeoutRef.current);
                        copyTimeoutRef.current = window.setTimeout(() => setCopied(false), 1500);
                      });
                    }
                  }}
                  disabled={!user.slug && !slug}
                  aria-label="Copy public profile link"
                  className="p-1 rounded-md bg-green-50 text-green-700 hover:bg-green-100 active:translate-y-0.5 active:scale-95 transition-transform duration-100"
                >
                  <LinkIcon size={18} />
                </button>

                <span
                  aria-live="polite"
                  className={`text-sm font-medium text-green-700 transition-opacity duration-200 ${copied ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}
                >
                  {copied ? 'Copied!' : ''}
                </span>
              </div>
            </div>
            <div className="text-sm text-neutral-600">{user.email}</div>
            <div className="text-xs text-neutral-500 mt-1">{user.role ?? 'Learner'}</div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold mb-2 text-black">Public profile id (one-time)</h3>
          </div>

          {user.slug ? (
            <div className="flex items-center gap-3">
              <div className="px-3 py-2 rounded-md bg-neutral-100 text-sm">/profile/{user.slug}</div>
              <div className="text-xs text-red-600 ml-2">You have set your public id and it cannot be changed.</div>
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value.trim().toLowerCase())}
                placeholder="choose-a-unique-id"
                className="p-2 rounded-md border border-neutral-200 text-black bg-[#f3efe8]"
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
