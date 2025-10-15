"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Register() {
  return (
    <div className="bg-[#f9f0eb] text-neutral-900 min-h-screen flex items-center justify-center py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-white/10"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 text-center">
          Create an Account
        </h1>
        <p className="text-neutral-700 mb-8 text-center">
          Join Aakar and start your journey with us.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Thanks! Register handler not yet implemented.");
          }}
          className="grid grid-cols-1 gap-4"
        >
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-neutral-700">Your name</span>
            <input
              name="name"
              type="text"
              required
              className="bg-[#f3efe8] border border-neutral-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </label>
        
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-neutral-700">Email</span>
            <input
              name="email"
              type="email"
              required
              className="bg-[#f3efe8] border border-neutral-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-neutral-700">Password</span>
            <input
              name="password"
              type="password"
              required
              className="bg-[#f3efe8] border border-neutral-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-neutral-700">Confirm Password</span>
            <input
              name="confirmPassword"
              type="password"
              required
              className="bg-[#f3efe8] border border-neutral-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </label>
          
          <div className="flex items-center justify-between gap-4 mt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-900 text-white font-semibold px-6 py-3 shadow hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
            >
              Create Account
            </motion.button>
          </div>
          <div className="text-center mt-4 text-sm text-neutral-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-green-700 hover:underline">
              Log in here
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
