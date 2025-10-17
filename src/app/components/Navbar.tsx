'use client';
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('aakar_role') : null;
    if (stored) setLocalRole(stored);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    let intervalId: number | undefined;
    const fetchUnread = async () => {
      if (!session?.user?.id) {
        setUnreadCount(0);
        return;
      }
      try {
        const res = await fetch('/api/chat/unread-chats', {
          method: 'GET',
          credentials: 'include',
        });
        if (!res.ok) {
          setUnreadCount(0);
          return;
        }
        const data = (await res.json()) as { count?: number };
        setUnreadCount(data.count ?? 0);
      } catch {
        setUnreadCount(0);
      }
    };
    fetchUnread();
    intervalId = window.setInterval(fetchUnread, 5000);
    return () => {
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [session?.user?.id]);

  const userRole = session?.user?.role || localRole;

  const buttonBase = "text-lg py-2 px-4 rounded-full border-2 transition-all duration-300";
  const buttonLoggedIn = `${buttonBase} border-neutral-200 text-neutral-200 hover:bg-neutral-200 hover:text-green-900`;

  if (!mounted) {
    return (
      <nav className="bg-green-800 py-2 sticky top-0 z-50 shadow-sm">
        <div className="flex font-medium text-neutral-200 justify-between items-center px-8 mx-auto">
          <div className="text-6xl tracking-tight hover:tracking-wide transition-all duration-300 font-medium gajraj-one-regular">
            <Link href="/" className="flex flex-row items-center">
              <Image src="/logo2.png" width={50} height={50} alt="logo" />
              <span className="pl-5">Aakar</span>
            </Link>
          </div>

          <div className="flex flex-row gap-4 sm:gap-8 items-center">
            <Link href="/contact" className={`text-lg relative py-2 px-4 rounded-full border-2 transition-all duration-300 border-transparent hover:border-neutral-200`}>Contact</Link>
            <Link href="/about" className={`text-lg relative py-2 px-4 rounded-full border-2 transition-all duration-300 border-transparent hover:border-neutral-200`}>About us</Link>
            <Link href="/signin" className="text-lg py-2 px-4 rounded-full border-2 transition-all duration-300 bg-neutral-200 text-green-900 border-neutral-200 hover:bg-neutral-300 hover:border-neutral-300">Sign In</Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-green-800 py-2 sticky top-0 z-50 shadow-sm">
      <div className="flex font-medium text-neutral-200 justify-between items-center px-8 mx-auto">
        <div className="text-6xl tracking-tight hover:tracking-wide transition-all duration-300 font-medium gajraj-one-regular">
          <Link href="/" className="flex flex-row items-center">
            <Image src="/logo2.png" width={50} height={50} alt="logo" />
            <span className="pl-5">Aakar</span>
          </Link>
        </div>

        <div className="flex flex-row gap-4 sm:gap-8 items-center">
          {!session?.user ? (
            <>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} className={`text-lg relative py-2 px-4 rounded-full border-2 transition-all duration-300 ${isActive ? "bg-neutral-200 text-green-900 border-neutral-200" : "border-transparent hover:border-neutral-200"}`}>
                    {item.title}
                  </Link>
                );
              })}
              <Link href="/signin" className="text-lg py-2 px-4 rounded-full border-2 transition-all duration-300 bg-neutral-200 text-green-900 border-neutral-200 hover:bg-neutral-300 hover:border-neutral-300">Sign In</Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              {userRole && (
                <Link href={userRole === 'user' ? '/dashboard' : '/recruiter-dashboard'} className={buttonLoggedIn}>Dashboard</Link>
              )}

              <div className="relative">
                <Link href="/inbox" className={buttonLoggedIn}>Messages</Link>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold leading-none text-white bg-red-600 rounded-full shadow">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </div>

              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setDropdownOpen((prev) => !prev)} className="flex items-center justify-center gap-2 text-lg py-2 px-3 rounded-full border-2 border-neutral-200 text-neutral-200 transition-all duration-300 hover:bg-neutral-200 hover:text-green-900" aria-expanded={dropdownOpen} aria-haspopup="true" type="button">
                  <Image src={session.user.image || '/default-avatar.png'} width={32} height={32} alt="User Profile" className="rounded-full" />
                  <svg className="w-3 h-3" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M5 7l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg text-neutral-800 overflow-hidden">
                    {userRole === 'user' && (
                      <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-neutral-100" onClick={() => setDropdownOpen(false)}>Profile</Link>
                    )}
                    <Link href="/about" className="block px-4 py-2 text-sm hover:bg-neutral-100" onClick={() => setDropdownOpen(false)}>About us</Link>
                    <button onClick={() => signOut({ callbackUrl: '/' })} className="block w-full text-left px-4 py-2 text-sm hover:bg-neutral-100">Sign out</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
