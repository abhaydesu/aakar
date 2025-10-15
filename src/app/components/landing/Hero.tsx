import React from "react";
import Link from "next/link";

export const Hero = () => {
  return (
    <div className="relative grid md:grid-cols-5 bg-[#f9f0eb]">
     

      <div className="col-span-2 tracking-tight font-medium flex flex-col items-center">
        <h1 className="text-center pt-40 pb-6 md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.92] text-neutral-900">
          <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-700">
            Your skills,
          </span>
          <br />
          <span className="inline-block text-green-300 drop-shadow-[1px_1px_0_#0a0a0a]">
            unified.
          </span>
        </h1>

        <p className="text-2xl text-center max-w-lg pb-20">
          Aggregate, verify, and showcase all your micro-credentials from any
          platform in one professional portfolio.
        </p>

        <div className="flex flex-col items-center gap-6">
          <div className="gap-10 flex justify-center items-center">
            <Link href="/dashboard">
            <button
              className="relative cursor-pointer py-4 px-6 rounded-sm bg-neutral-900 text-[#f9f0eb] font-semibold
                         border-4 border-transparent transition-all duration-180 transform-gpu will-change-transform
                         hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
              aria-label="Get started"
            >
              {/* decorative inner outline (purely visual, doesn't affect layout) */}
              <span className="absolute inset-0 rounded-xl pointer-events-none" />
              <span className="relative z-10">Get started</span>
            </button>
            </Link>

            <button
              className="relative cursor-pointer py-4 px-6 rounded-sm bg-green-200 text-neutral-900 font-medium
                         border-4 border-transparent transition-colors duration-180 transform-gpu will-change-transform
                         hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
              aria-label="Watch demo"
            >
              <span className="relative z-10">Watch Demo</span>
            </button>
          </div>

          <div className="mt-1 text-sm text-neutral-600 flex items-center gap-3">
            <span className="inline-flex items-center gap-2 bg-white/60 rounded-full px-3 py-1 shadow-sm">
              <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Verified credentials
            </span>
          </div>
        </div>
      </div>

      <div className="col-span-3 relative">
        <img src="/landing.jpg" alt="landing" className="w-full h-auto rounded-md shadow-md object-cover" />

        <div className="absolute bottom-6 left-8 md:left-12 bg-white rounded-xl p-3 shadow-md w-60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-gradient-to-br from-green-200 to-green-300 flex items-center justify-center font-bold text-neutral-900">
              C
            </div>
            <div>
              <div className="text-sm font-semibold">Credential Verified</div>
              <div className="text-xs text-neutral-500">Blockchain-backed · ID 0x7a...d2f</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
