'use client';

import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, Variants, Easing } from 'framer-motion';

/**
 * Use a properly typed Easing value instead of casting to `any`.
 * Framer Motion accepts a numeric cubic-bezier array at runtime and Easing
 * is the correct type to represent that to TypeScript.
 */
const customEase: Easing = [0.22, 1, 0.36, 1];

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: customEase,
      staggerChildren: 0.1,
      when: 'beforeChildren',
    },
  },
};

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-[#f9f0eb] text-neutral-900 inter relative overflow-x-hidden">
      <motion.div
        className="pointer-events-none absolute inset-0 w-full"
        style={{
          maskImage: "radial-gradient(ellipse at top, black 20%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at top, black 20%, transparent 70%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      />

      <div className="relative z-10">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24">
          <motion.h2
            className="text-center text-4xl md:text-6xl font-extrabold tracking-tight mb-4"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-700">
              Contact Us
            </span>{' '}
          </motion.h2>

          <motion.p
            className="text-center text-neutral-600 max-w-2xl mx-auto mb-10"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            Have a question, partnership inquiry, or feedback? Fill out the form below and we’ll get back to you soon.
          </motion.p>

          <motion.form
            onSubmit={handleSubmit}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="relative bg-white rounded-sm border border-transparent shadow-md p-8"
            aria-label="Contact form"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Anon Sharma"
                  className="w-full px-4 py-3 rounded-sm bg-neutral-50 border border-neutral-200 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-green-800 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="anon@works.com"
                  className="w-full px-4 py-3 rounded-sm bg-neutral-50 border border-neutral-200 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-green-800 transition"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">Message</label>
              <textarea
                name="message"
                rows={5}
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="Send us a message..."
                className="w-full px-4 py-3 rounded-sm bg-neutral-50 border border-neutral-200 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-green-800 transition resize-none"
              />
            </div>

            <div className="mt-8 text-center">
              <button className="bg-green-800 w-full py-3 rounded-sm" type="submit" aria-label="Send message">
                {submitted ? 'Message Sent!' : 'Send Message'}
              </button>
            </div>
          </motion.form>
        </main>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
