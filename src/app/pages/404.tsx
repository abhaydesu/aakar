'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Custom404 = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#f9f0eb] text-neutral-900 p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl p-8 shadow-lg text-center">
        <div className="text-6xl font-extrabold mb-4">404</div>
        <h1 className="text-2xl font-semibold mb-2">Page Not Found</h1>
        <p className="text-neutral-600 mb-6">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => router.push('/')}
            className="px-5 py-2 rounded-2xl bg-neutral-900 text-white font-medium shadow-sm hover:opacity-95"
          >
            Go to Home
          </button>

          {status === 'unauthenticated' ? (
            <button
              onClick={() => router.push('/signin')}
              className="px-5 py-2 rounded-2xl border border-neutral-200 text-neutral-900 font-medium bg-white shadow-sm hover:opacity-95"
            >
              Sign In
            </button>
          ) : (
            <button
              onClick={() => router.back()}
              className="px-5 py-2 rounded-2xl border border-neutral-200 text-neutral-900 font-medium bg-white shadow-sm hover:opacity-95"
            >
              Go Back
            </button>
          )}
        </div>

        <div className="mt-6 text-sm text-neutral-500">
          If you think this is an error, please check the URL or contact support.
        </div>
      </div>
    </main>
  );
};

export default Custom404;