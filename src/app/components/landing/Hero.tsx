"use client";

import React from "react";
import { motion, Variants, Transition } from "framer-motion";

// define a Transition and then use it in Variants
const spring: Transition = { type: "spring", stiffness: 120, damping: 16 };

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: spring },
};


const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.12,
    },
  },
};


const floatY: Variants = {
  animate: { y: [0, -8, 0], transition: { duration: 6, repeat: Infinity, ease: "easeInOut" } },
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#f9f0eb]">

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <motion.div
          className="grid md:grid-cols-5 gap-6 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <div className="col-span-2 flex flex-col items-center md:items-start text-center md:text-left">
            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.92] text-neutral-900"
              aria-label="Your skills unified"
            >
              <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-700">
                Your skills,
              </span>
              <br />
              <span className="inline-block text-green-700">unified.</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-6 text-lg md:text-2xl max-w-xl text-neutral-700">
              Aggregate, verify, and showcase all your micro-credentials from any platform in one professional
              portfolio.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex gap-6 justify-center md:justify-start">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative overflow-hidden  px-6 py-3 font-semibold shadow-lg bg-neutral-900 text-[#f9f0eb]"
                aria-label="Get started"
              >
                <span className="absolute inset-0  border-2 border-transparent hover:border-green-200 transition-all pointer-events-none" />
                <span className="relative z-10">Get started</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                className=" px-5 py-3 font-medium bg-green-200 text-neutral-900 flex items-center gap-3 shadow-sm"
                aria-label="Watch demo"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 3v18l15-9L5 3z" />
                </svg>
                <span>Watch demo</span>
              </motion.button>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex items-center gap-4 text-sm text-neutral-600"
            >
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-300 shadow-sm" />
                Verified credentials
              </span>

              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neutral-300 shadow-sm" />
                Cross-platform
              </span>
            </motion.div>
          </div>

          <div className="col-span-3 relative flex justify-center md:justify-end items-center">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 90, damping: 20 }}
              className="w-full max-w-3xl"
            >
              <motion.img
                src="/landing.jpg"
                alt="landing"
                className="rounded-3xl shadow-2xl w-full object-cover border-[6px] border-white"
                variants={floatY}
                animate="animate"
                draggable={false}
              />

              {/* subtle card overlay */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.28, type: "spring", stiffness: 80 }}
                className="absolute -bottom-8 left-8 md:left-12 bg-white rounded-xl p-4 shadow-md w-64 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-gradient-to-br from-green-200 to-green-300 flex items-center justify-center font-bold text-neutral-900">
                    C
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Credential Verified</div>
                    <div className="text-xs text-neutral-500">Blockchain-backed · ID 0x7a...d2f</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
