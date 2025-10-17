'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function OnboardingBanner() {
  // CORRECTED: Start with the banner visible by default.
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // When the component loads in the browser, check if the user
    // has previously dismissed it. If so, hide it.
    const dismissed = localStorage.getItem('aakar-banner-dismissed');
    if (dismissed) {
      setIsVisible(false);
    }
  }, []); // This effect runs once after the component mounts.

  const handleDismiss = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsVisible(false);
    localStorage.setItem('aakar-banner-dismissed', 'true');
  };

  // If not visible, render nothing.
  if (!isVisible) {
    return null;
  }

  return (
    <div className="absolute top-20 w-full bg-[#ffdeb8] text-green-800" role="alert">
      <div className="max-w-5xl mx-auto px-6 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left gap-3">
          <p className="text-sm sm:text-base">
            <span className="font-semibold">This portfolio is powered by Aakar.</span>
            {' '} Showcase your skills in one unified portfolio—just like this one.
          </p>
          <Link href="/" passHref>
            <button className="py-2 px-4 text-sm rounded-lg bg-green-900 text-green-50 font-semibold hover:bg-green-700 transition-colors flex-shrink-0 cursor-pointer">
              Create Your Free Portfolio
            </button>
          </Link>
        </div>
      </div>
      <button
        onClick={handleDismiss}
        aria-label="Dismiss"
        className="absolute top-1/2 -translate-y-1/2 right-3 p-2 text-green-800/70 hover:text-green-500 cursor-pointer transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}