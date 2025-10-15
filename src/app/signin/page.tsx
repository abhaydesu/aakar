"use client";

import React, { useEffect, useState } from "react";
import { signIn, useSession, getProviders, ClientSafeProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SignIn() {
  const { data: session } = useSession();
  const router = useRouter();
  const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null);

  useEffect(() => {
    if (session) {
      router.push('/dashboard'); 
    }
  }, [session, router]);
  
  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res);
    })();
  }, []);

  return (
    <div className="bg-[#f9f0eb] text-neutral-900 min-h-screen flex items-center justify-center py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-white/10 text-center"
      >
        <div className="mx-auto mb-6 h-16 w-16">
           <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-800"><path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/></svg>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">
          Sign In to Aakar
        </h1>
        <p className="text-neutral-700 mb-8">
          Continue with your Google account to get started.
        </p>
        
        {providers &&
          Object.values(providers).map((provider) => (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              key={provider.name}
              onClick={() => signIn(provider.id, { callbackUrl: '/dashboard' })}
              className="w-full inline-flex items-center justify-center gap-3 rounded-lg bg-neutral-900 text-white font-semibold px-6 py-3 shadow hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
            >
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.222 0-9.618-3.226-11.283-7.583l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 35.832 44 30.138 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
              </svg>
              Sign in with {provider.name}
            </motion.button>
          ))}
      </motion.div>
    </div>
  );
}