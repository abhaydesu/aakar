'use client';

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from 'next-auth/react';

const navItems = [
  { title: 'Contact', href: '/contact' },
  { title: 'About us', href: '/about' },
];

export const Navbar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [localRole, setLocalRole] = useState<string | null>(null);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('aakar_role') : null;
    if (stored) setLocalRole(stored);
  }, []);

  const userRole = session?.user?.role || localRole;

  return (
    <nav className="bg-green-800 py-2 sticky top-0 z-50 shadow-sm">
      <div className="flex font-medium text-neutral-200 justify-between items-center px-8 mx-auto">
        <div className="text-6xl tracking-tight hover:tracking-wide transition-all duration-300 font-medium gajraj-one-regular">
          <Link className="flex flex-row items-center" href="/">
            <Image src="/logo2.png" width={50} height={50} alt="logo" />
            <span className="pl-5">Aakar</span>
          </Link>
        </div>

        <div className="flex flex-row gap-4 sm:gap-8 items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-lg relative py-2 px-4 rounded-full border-2 transition-all duration-300 ${isActive ? "bg-neutral-200 text-green-900 border-neutral-200" : "border-transparent hover:border-neutral-200"}`}
              >
                {item.title}
              </Link>
            );
          })}

          {session?.user ? (
            <div className="flex items-center gap-4">
              {userRole && (
                <Link
                  href={userRole === 'user' ? '/dashboard' : '/recruiter-dashboard'}
                  className="text-lg py-2 px-4 rounded-full border-2 transition-all duration-300 border-neutral-200 text-neutral-200 hover:bg-neutral-200 hover:text-green-900"
                >
                  Dashboard
                </Link>
              )}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center justify-center gap-2 text-lg py-2 px-4 rounded-full border-2 border-neutral-200 text-neutral-200 transition-all duration-300 hover:bg-neutral-200 hover:text-green-900"
              >
                <Image
                  src={session.user.image || '/default-avatar.png'}
                  width={32}
                  height={32}
                  alt="User Profile"
                  className="rounded-full"
                />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <Link
              href="/signin"
              className="text-lg py-2 px-4 rounded-full border-2 transition-all duration-300 bg-neutral-200 text-green-900 border-neutral-200 hover:bg-neutral-300 hover:border-neutral-300"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
