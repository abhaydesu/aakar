import React from "react";
import Link from "next/link";
import Image from "next/image"; 

export const Hero = () => {
  return (
    <div className="bg-[#f9f0eb] min-h-screen grid grid-cols-1 md:grid-cols-5 items-center">

      <div className="col-span-1 md:col-span-2 order-first flex flex-col items-center md:items-start text-center md:text-left px-6 py-10 md:pl-12 md:py-0">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.95] text-neutral-900">
          <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-700">
            Your skills,
          </span>
          <br />
          <span className="inline-block text-green-800 drop-shadow-[1px_1px_0_#0a0a0a]">
            unified.
          </span>
        </h1>

        <p className="text-lg md:text-xl max-w-lg mt-6 mb-8 text-neutral-800">
          Aggregate, verify, and showcase all your micro-credentials from any
          platform in one professional portfolio.
        </p>

        <div className="flex flex-col items-center md:items-start gap-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <Link href="/dashboard">
              <button
                className="relative cursor-pointer py-3 px-6 rounded-md bg-neutral-900 text-[#f9f0eb] font-semibold
                           border-2 border-transparent transition-all duration-200 transform-gpu 
                           hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
                aria-label="Get started"
              >
                Get started
              </button>
            </Link>

            <button
              className="relative cursor-pointer py-3 px-6 rounded-md bg-green-800 text-neutral-100 font-medium
                         border-2 border-transparent transition-all duration-200 transform-gpu
                         hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-800"
              aria-label="Watch demo"
            >
              Watch Demo
            </button>
          </div>

          <div className="mt-1 text-sm text-neutral-600 flex items-center">
            <span className="inline-flex items-center gap-2 bg-white/60 rounded-full px-3 py-1 shadow-sm">
              <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Verified credentials
            </span>
          </div>
        </div>
      </div>
      
      <div className="col-span-1 md:col-span-3 order-last relative h-64 md:h-auto">
        <div className="block md:hidden absolute inset-0">
           <Image src="/landing.jpg" alt="A professional portfolio showcasing verified credentials" layout="fill" objectFit="cover" priority />
        </div>
        <div className="hidden md:block">
            <Image src="/landing.jpg" alt="A professional portfolio showcasing verified credentials" width={1200} height={800} objectFit="cover" priority />
        </div>

        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-8 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg max-w-[240px]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-gradient-to-br from-green-600 to-green-800 flex-shrink-0 flex items-center justify-center font-bold text-white">
              C
            </div>
            <div>
              <div className="text-sm font-semibold text-neutral-900">Credential Verified</div>
              <div className="text-xs text-neutral-500 truncate">ID 0x74a...c2e</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};