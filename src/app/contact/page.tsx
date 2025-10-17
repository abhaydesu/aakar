// src/app/contact/page.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const TEAM = [
  { name: "Kushagra Shukla", github: "https://github.com/kushu30" },
  { name: "Abhay Singh", github: "https://github.com/abhaydesu" },
  { name: "Angelica Singh",  github: "https://github.com/angelica-singh-04" },
  { name: "Aditya", github: "https://github.com/" },
  { name: "Abhimanyu Dutta", github: "https://github.com/Caravaleer" },
  { name: "Prajakta Naik", github: "https://github.com/" },
];

export default function Contact() {
  return (
    <div className="bg-[#f9f0eb] text-neutral-900 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-white/10">
              <h2 className="text-2xl font-extrabold mb-2">Meet the team</h2>
              <p className="text-sm text-neutral-600 mb-6">
                HEXADECIMAL — the minds building Aakar.
              </p>

              <div className="grid grid-cols-1 gap-4">
                <TeamGrid members={TEAM} />
              </div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-white/10"
          >
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
              Get in touch
            </h1>
            <p className="text-neutral-700 mb-8 max-w-2xl">
              Questions, partnership ideas, or policy discussions — we want to hear them all.
              Fill out the form and we&apos;ll get back to you within 3 business days.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thanks! form handler not yet implemented.");
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
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

              <label className="md:col-span-2 flex flex-col gap-2">
                <span className="text-sm font-medium text-neutral-700">Subject</span>
                <input
                  name="subject"
                  type="text"
                  placeholder="Collaboration / Support / Partnership"
                  className="bg-[#f3efe8] border border-neutral-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-300"
                />
              </label>

              <label className="md:col-span-2 flex flex-col gap-2">
                <span className="text-sm font-medium text-neutral-700">Message</span>
                <textarea
                  name="message"
                  rows={6}
                  required
                  className="bg-[#f3efe8] border border-neutral-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-300 resize-none"
                />
              </label>

              <div className="md:col-span-2 flex items-center justify-between gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-900 text-white font-semibold px-6 py-3 shadow hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
                >
                  Send message
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function TeamGrid({ members }: { members: { name: string; github: string }[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {members.map((m) => (
        <motion.button
          key={m.name}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full text-left flex items-center gap-3 bg-[#f9f0eb] border border-neutral-200 rounded-lg p-3 hover:shadow-sm focus:outline-none"
          onClick={() => {}}
          aria-label={`Open profile for ${m.name}`}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-green-800 text-neutral-900 font-bold flex items-center justify-center text-lg">
            {initials(m.name)}
          </div>

          <div className="flex-1">
            <Link href={m.github} >
              <div className="text-sm font-semibold">{m.name}</div>
            </Link>
          </div>
        </motion.button>
      ))}
    </div>
  );
}

function initials(name: string) {
  const parts = name.split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
