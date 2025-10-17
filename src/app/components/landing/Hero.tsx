import React from "react";
import Link from "next/link";

export const Hero = () => {
  return (
    <div className="bg-[#f9f0eb] min-h-screen md:min-h-[640px] grid md:grid-cols-5 items-center">
      <div className="col-span-2 tracking-tight font-medium flex flex-col items-center px-6 md:px-0">
        <h1 className="text-center pt-8 md:pt-12 pb-6 text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.92] text-neutral-900">
          <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-700">
            Your skills,
          </span>
          <br />
          <span className="inline-block text-green-800 drop-shadow-[1px_1px_0_#0a0a0a]">
            unified.
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-center max-w-lg pb-8 md:pb-12 ">
          Aggregate, verify, and showcase all your micro-credentials from any
          platform in one professional portfolio.
        </p>

        <div className="flex flex-col items-center gap-6 w-full">
          <div className="gap-6 flex flex-row justify-center items-center w-full">
            {/* --- Primary Button: "Aurora" Style --- */}
{/* --- Primary Button: "Shine & Gradient Shift" Style --- */}
<Link href="/dashboard" aria-label="Get started">
  <button
    className="group relative inline-flex items-center justify-center gap-2 overflow-hidden cursor-pointer
               py-3 px-6 rounded-lg bg-gradient-to-br from-green-700 to-green-900
               text-white font-semibold text-lg shadow-lg
               transition-all duration-300 ease-out
               "
  >
    <span 
      className="absolute inset-0 w-full h-full transform translate-x-full 
                 bg-gradient-to-r from-transparent via-white/40 to-transparent 
                 group-hover:-translate-x-full transition-transform duration-700 ease-out"
    />
    <span 
      className="absolute inset-0 w-full h-full bg-gradient-to-br from-green-800 to-green-600 
                 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    />
    
    <span className="relative z-10 flex items-center gap-2">
      Get started
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 20 20" 
        fill="currentColor" 
        className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
      >
        <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
      </svg>
    </span>
  </button>
</Link>

<Link target="_blank" href="https://youtu.be/fM4Vzcqg9L0" aria-label="Watch Demo">
<button
  className="group relative inline-flex items-center justify-center cursor-pointer overflow-hidden
             py-2.5 px-6 rounded-lg bg-white
             text-green-800 font-semibold text-lg border-2 border-green-800
             transition-colors duration-300 ease-out
             active:translate-y-px"
  aria-label="Watch demo"
>
  {/* This span creates the background fill effect. 
    It starts with a width of 0 (scale-x-0) and expands to full width on hover.
  */}
  <span
    className="absolute inset-0 z-0 h-full w-full bg-[#ffdeb8]
               transform scale-x-0 transition-transform duration-300 ease-in-out
               origin-left group-hover:scale-x-100"
  />

  {/* This span holds the content (icon + text).
    It moves as a single unit and changes color on hover.
  */}
  <span
    className="relative z-10 flex items-center gap-2
               transition-all duration-300 ease-in-out
               group-hover:translate-x-1 group-hover:text-green-800"
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 20 20" 
      fill="currentColor" 
      className="w-5 h-5"
    >
      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
    </svg>
    <span>
      Watch Demo
    </span>
  </span>
</button>
</Link>
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

      {/* RIGHT: image column */}
      <div className="col-span-3 relative px-6 md:px-0">
        {/* image: smaller fixed height on mobile, original behaviour on md+ */}
        <img
          src="/landing.jpg"
          alt="landing"
          className="w-full h-[220px] sm:h-64 md:h-auto rounded-md shadow-md object-cover"
        />

        {/* credential card: centered on mobile, original left position on md+ */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 md:left-8 md:translate-x-0 bg-white rounded-xl p-3 shadow-md w-64 md:w-60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center font-bold text-neutral-900">
              C
            </div>
            <div>
              <div className="text-sm font-semibold">Credential Verified</div>
              <div className="text-xs text-neutral-500">ID 0x7a...d2f</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
