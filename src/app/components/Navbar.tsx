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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
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
        const data: { unreadConversations?: number } = await res.json();
        setUnreadCount(data.unreadConversations ?? 0);
      } catch {
        setUnreadCount(0);
      }
    };
    fetchUnread();
    const intervalId = window.setInterval(fetchUnread, 5000);
    return () => {
      window.clearInterval(intervalId);
    };
  }, [session?.user?.id]);

  const userRole = session?.user?.role || localRole;

  const buttonBase = "text-lg py-2 px-4 rounded-full transition-all duration-300";
  const buttonLoggedIn = `${buttonBase} text-neutral-200 hover:bg-neutral-200 hover:text-green-900`;

  if (!mounted) {
    return (
      <nav className="bg-green-800 py-2 sticky top-0 z-50 shadow-sm">
        <div className="flex font-medium text-neutral-200 justify-between items-center px-4 sm:px-8 mx-auto">
          <div className="text-4xl sm:text-6xl tracking-tight hover:tracking-wide transition-all duration-300 font-medium gajraj-one-regular">
            <Link href="/" className="flex flex-row items-center">
              <Image src="/logo2.png" width={50} height={50} alt="logo" />
              <span className="pl-3 sm:pl-5">Aakar</span>
            </Link>
          </div>
          <div className="h-8 w-24 bg-green-700 rounded-full animate-pulse"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-green-800 sticky top-0 z-50 shadow-sm">
      <div className="flex font-medium text-neutral-200 justify-between items-center px-4 sm:px-8 mx-auto py-3">
        <div className="text-4xl sm:text-6xl tracking-tight hover:tracking-wide transition-all duration-300 font-medium gajraj-one-regular">
          <Link href="/" className="flex flex-row items-center">
            <Image src="/logo2.png" width={50} height={50} alt="logo" />
            <span className="pl-3 sm:pl-5">Aakar</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-row gap-4 sm:gap-8 items-center">
          {!session?.user ? (
            <>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-lg relative py-2 px-4 rounded-full border-2 transition-all duration-300 ${pathname === item.href ? "bg-neutral-200 text-green-900 border-neutral-200" : "border-transparent hover:border-neutral-200"}`}
                >
                  {item.title}
                </Link>
              ))}
              <Link
                href="/signin"
                className="text-lg py-2 px-4 rounded-full border-2 transition-all duration-300 bg-neutral-900 text-neutral-200 border-neutral-900 hover:bg-neutral-200 hover:border-neutral-900 hover:text-neutral-900"
              >
                Sign In
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              {userRole && (
                <Link href={userRole === 'user' ? '/dashboard' : '/recruiter-dashboard'} className={buttonLoggedIn}>
                  Dashboard
                </Link>
              )}
              <div className="relative">
                <Link href="/inbox" className={`${buttonLoggedIn} py-3`}>
                  Messages
                </Link>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold leading-none text-white bg-red-600 rounded-full shadow">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </div>
              <Link href="/about" className={`${buttonLoggedIn} py-3`}>
                About
              </Link>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center justify-center gap-2 text-lg py-2 px-3 rounded-full text-neutral-200 transition-all duration-300 bg-neutral-800 hover:bg-neutral-200 hover:text-neutral-800 cursor-pointer"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                  type="button"
                >
                  <Image
                    src={session.user.image || '/default-avatar.png'}
                    width={32}
                    height={32}
                    alt="User Profile"
                    className="rounded-full"
                  />
                  <svg className="w-3 h-3" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M5 7l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-5 border-2 border-green-800 w-44 bg-white rounded-lg shadow-lg text-neutral-800 overflow-hidden">
                    {userRole === 'user' && (
                      <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-neutral-100" onClick={() => setDropdownOpen(false)}>
                        Profile
                      </Link>
                    )}
                    <button onClick={() => signOut({ callbackUrl: '/' })} className="block w-full text-left px-4 py-2 text-sm hover:bg-neutral-100">
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu Button (Hamburger) */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-neutral-200 hover:bg-green-700 focus:outline-none"
            aria-controls="mobile-menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            {isMobileMenuOpen ? (
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {!session?.user ? (
              <>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === item.href ? 'bg-green-900 text-white' : 'text-neutral-300 hover:bg-green-700 hover:text-white'}`}
                  >
                    {item.title}
                  </Link>
                ))}
                <Link
                  href="/signin"
                  className="block w-full text-left mt-2 px-3 py-2 rounded-md text-base font-medium text-neutral-300 hover:bg-green-700 hover:text-white"
                >
                  Sign In
                </Link>
              </>
            ) : (
              <>
                {userRole && (
                    <Link href={userRole === 'user' ? '/dashboard' : '/recruiter-dashboard'} className="block px-3 py-2 rounded-md text-base font-medium text-neutral-300 hover:bg-green-700 hover:text-white">
                        Dashboard
                    </Link>
                )}
                <Link href="/inbox" className="flex items-center px-3 py-2 rounded-md text-base font-medium text-neutral-300 hover:bg-green-700 hover:text-white">
                    Messages
                    {unreadCount > 0 && (
                        <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </Link>
                <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-300 hover:bg-green-700 hover:text-white">
                  About
                </Link>
                {userRole === 'user' && (
                    <Link href="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-300 hover:bg-green-700 hover:text-white">
                        Profile
                    </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="block w-full text-left mt-1 px-3 py-2 rounded-md text-base font-medium text-neutral-300 hover:bg-green-700 hover:text-white"
                >
                  Sign out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;