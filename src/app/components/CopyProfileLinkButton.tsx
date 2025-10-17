"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "aakar_welcome_dismissed_v1";

export default function ProfileWelcomeBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (!dismissed) setShow(true);
    } catch (e) {
      // in case localStorage is blocked, still show banner
      setShow(true);
    }
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch (e) {
      // ignore
    }
    setShow(false);
  }

  if (!show) return null;

  return (
    <>
      {/* Top sticky banner for small screens */}
      <div className="md:hidden fixed top-4 left-4 right-4 z-50">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-md flex items-start gap-3">
          <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center font-bold text-neutral-900">
            A
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm text-neutral-900">Welcome to Aakar</div>
            <div className="text-xs text-neutral-600 mt-1">
              Aakar aggregates verifiable micro-credentials so learners can collect and showcase short-term learning achievements.
            </div>
            <div className="mt-3 flex items-center gap-3">
              <Link href="/signup" legacyBehavior>
                <a className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-green-800 text-white text-sm font-medium shadow-sm">
                  Start using Aakar
                </a>
              </Link>
              <Link href="/learn-more" legacyBehavior>
                <a className="text-sm text-neutral-700 underline">Learn more</a>
              </Link>
            </div>
          </div>
          <button
            aria-label="Dismiss"
            onClick={dismiss}
            className="ml-2 text-neutral-500 hover:text-neutral-700 p-1.5 rounded-md"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Floating toaster for md+ */}
      <div className="hidden md:block fixed bottom-8 right-8 z-50">
        <div className="max-w-sm bg-white rounded-2xl px-4 py-4 shadow-lg border border-neutral-100 w-80">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center font-bold text-neutral-900">
              A
            </div>
            <div className="flex-1">
              <div className="font-semibold text-neutral-900">Discover Aakar</div>
              <div className="text-xs text-neutral-600 mt-1">
                Collect verifiable micro-credentials, display them in a professional portfolio, and share your verified profile with employers.
              </div>

              <div className="mt-3 flex items-center gap-2">
                <Link href="/signup" legacyBehavior>
                  <a className="inline-flex items-center justify-center px-3 py-2 rounded-md bg-green-800 text-white text-sm font-medium shadow-sm">
                    Get started
                  </a>
                </Link>

                <button
                  onClick={() => {
                    // one-click copy profile link heuristic: copy current url (works on client)
                    try {
                      navigator.clipboard.writeText(window.location.href);
                    } catch {}
                  }}
                  className="px-3 py-2 text-sm rounded-md bg-neutral-100 text-neutral-800"
                >
                  Copy profile link
                </button>
              </div>
            </div>

            <div className="ml-2 flex flex-col items-end gap-1">
              <button
                aria-label="Dismiss"
                onClick={dismiss}
                className="text-neutral-400 hover:text-neutral-600 p-1 rounded-md"
              >
                ✕
              </button>
              <div className="text-xs text-neutral-400">New here?</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
