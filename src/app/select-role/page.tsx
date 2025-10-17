// src/app/select-role/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function SelectRolePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/signin');
    if (status === 'loading') return;
    if (session?.user?.role) {
      router.push(session.user.role === 'recruiter' ? '/recruiter-dashboard' : '/dashboard');
    }
  }, [session, status, router]);

  const pickRole = async (role: 'user' | 'recruiter') => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/user/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
        credentials: 'include',
      });
      if (res.ok) {
        toast.success('Role saved');
        router.push(role === 'recruiter' ? '/recruiter-dashboard' : '/dashboard');
      } else {
        const txt = await res.text().catch(() => '');
        console.error('save role failed', res.status, txt);
        toast.error('Failed to save role');
      }
    } catch (e) {
      console.error(e);
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f9f0eb]">
      <div className="max-w-lg w-full bg-white rounded-xl p-8 shadow">
        <h1 className="text-2xl font-bold mb-4">Choose your role</h1>
        <p className="mb-6 text-neutral-600">Select a role to continue</p>
        <div className="flex gap-4">
          <button onClick={() => pickRole('user')} disabled={loading} className="flex-1 py-3 rounded-lg bg-neutral-900 text-white">
            {loading ? 'Saving...' : "I'm a Student"}
          </button>
          <button onClick={() => pickRole('recruiter')} disabled={loading} className="flex-1 py-3 rounded-lg bg-green-800 text-white">
            {loading ? 'Saving...' : "I'm a Recruiter"}
          </button>
        </div>
      </div>
    </main>
  );
}
