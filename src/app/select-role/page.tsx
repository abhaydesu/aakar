'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

export default function SelectRolePage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
      return;
    }
    if (status === 'authenticated' && session?.user?.role) {
      router.push(session.user.role === 'recruiter' ? '/recruiter-dashboard' : '/dashboard');
    }
  }, [status, session, router]);

  const handleRoleSelection = async (role: 'user' | 'recruiter') => {
    if (isLoading) return;
    if (session?.user?.role) {
      router.push(session.user.role === 'recruiter' ? '/recruiter-dashboard' : '/dashboard');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/user/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
        credentials: 'include',
      });

      if (res.ok) {
        try { await update?.({ ...session, user: { ...session?.user, role } }); } catch {}
        toast.success('Role saved successfully!');
        if (role === 'user') {
          router.push('/profile');
        } else {
          router.push('/recruiter-dashboard');
        }
      } else {
        const text = await res.text().catch(() => '');
        if (res.status === 403) {
          toast.error('Role already set. Redirecting...');
          router.push(session?.user?.role === 'recruiter' ? '/recruiter-dashboard' : '/dashboard');
        } else {
          console.error('Role update failed:', res.status, text);
          toast.error('Failed to save role. Please try again.');
        }
      }
    } catch (err) {
      console.error('Fetch error in handleRoleSelection:', err);
      toast.error('Network error. Check console.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#f9f0eb] min-h-screen flex items-center justify-center py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-white rounded-2xl p-8 md:p-12 shadow-lg text-center"
      >
        <h1 className="text-3xl font-extrabold tracking-tight mb-3 text-neutral-900">
          One Last Step
        </h1>
        <p className="text-neutral-700 mb-8">
          Please select your role to complete your profile.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            onClick={() => handleRoleSelection('user')}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-900 text-white font-semibold px-6 py-3 shadow disabled:bg-neutral-400"
          >
            {isLoading ? 'Saving...' : "I'm a User"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            onClick={() => handleRoleSelection('recruiter')}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-green-800 text-white font-semibold px-6 py-3 shadow disabled:bg-green-400"
          >
            {isLoading ? 'Saving...' : "I'm a Recruiter"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
