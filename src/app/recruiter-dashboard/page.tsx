'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RecruiterDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/signin');
    if (status === 'authenticated' && session?.user?.role !== 'recruiter') router.push('/select-role');
  }, [session, status, router]);

  if (status !== 'authenticated' || session?.user?.role !== 'recruiter') {
    return <main className="min-h-screen bg-[#f9f0eb] flex items-center justify-center"><div className="text-xl font-semibold text-neutral-700">Loading...</div></main>;
  }

  return (
    <main className="min-h-screen bg-[#f9f0eb] p-8 text-neutral-900">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-neutral-900">Recruiter Dashboard</h1>
        <p className="mt-2 text-neutral-700">Welcome, {session.user.name}.</p>
      </div>
    </main>
  );
}
