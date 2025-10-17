// src/app/recruiter-dashboard/page.tsx
'use client';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function RecruiterDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/signin');
    if (status === 'loading') return;
    if (status === 'authenticated') {
      if (session?.user?.role !== 'recruiter') router.push('/select-role');
    }
  }, [session, status, router]);

  if (status !== 'authenticated' || session?.user?.role !== 'recruiter') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <main className="min-h-screen p-8 bg-[#f9f0eb]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>
        <p className="mt-2">Welcome, {session.user.name}</p>
      </div>
    </main>
  );
}
