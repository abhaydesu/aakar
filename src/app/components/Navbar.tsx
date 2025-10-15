'use client';

import Link from "next/link";
import React from "react";
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
              <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-lg py-2 px-4 rounded-full border-2 transition-all duration-300 border-neutral-200 text-neutral-200 hover:bg-neutral-200 hover:text-green-900"
              >
                Sign Out
              </button>
              <Link href="/dashboard">
                <Image 
                  src={session.user.image || '/default-avatar.png'} 
                  width={40} 
                  height={40} 
                  alt="User Profile"
                  className="rounded-full"
                />
              </Link>
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