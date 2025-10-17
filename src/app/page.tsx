"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Hero } from "./components/landing/Hero";

export default function LandingPage() {
  return (
    <div className="bg-[#f9f0eb] text-neutral-900 min-h-screen">
      
      <section aria-label="Hero section">
          <Hero />
        </section>

      <main className="mx-auto max-w-7xl">
        <section className="py-20 px-6 md:px-12">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">All your micro-credentials. One trusted profile.</h2>
            <p className="text-lg text-neutral-600 mb-10 max-w-3xl mx-auto">
              Collect, verify and present verified credentials from any platform — with NSQF-aligned mapping and employer-ready verification.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <FeatureCard
                title="Unified aggregation"
                desc="Ingest certificates from Coursera, SWAYAM, NPTEL, DigiLocker and more — via API, CSV upload or issuer connectors."
                icon={<SvgStack />}
              />

              <FeatureCard
                title="Trusted verification"
                desc="Multi-tier verification: issuer APIs, DigiLocker / NCVET, optional blockchain signatures, and manual audit trails."
                icon={<SvgShield />}
              />

              <FeatureCard
                title="AI-powered deduplication"
                desc="Semantic matching and skill extraction to merge duplicate credentials and tag the skills you actually learned."
                icon={<SvgSpark />}
              />
            </div>
          </div>
        </section>

        <section className="bg-white/40 py-20 px-6 md:px-12">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">How it works — in 3 steps</h3>
              <ol className="space-y-6 text-neutral-700">
                <li>
                  <strong className="block text-lg">1. Connect or upload</strong>
                  <span className="text-sm">Sign in and connect your learning accounts, or upload PDFs/CSV files. We extract structured metadata and preserve original provenance.</span>
                </li>
                <li>
                  <strong className="block text-lg">2. Verify</strong>
                  <span className="text-sm">Automatic verification via issuer APIs, DigiLocker, or blockchain. Unverified items land in a review queue with audit logs.</span>
                </li>
                <li>
                  <strong className="block text-lg">3. Showcase</strong>
                  <span className="text-sm">Publish a verified skills portfolio with NSQF levels and share time-limited, auditable links with employers.</span>
                </li>
              </ol>

              <div className="mt-8">
                <Link className="inline-flex items-center gap-3 py-3 px-5 rounded-lg bg-neutral-900 text-white font-semibold hover:scale-[1.02] transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400" href="/dashboard">
                
                    Get started
                  
                </Link>
              </div>
            </div>

            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <Image src="/dashboard.png" alt="dashboard mockup" width={900} height={600} className="object-cover w-full h-full" />
            </div>
          </div>
        </section>

        {/* Employer / Analytics */}
        <section className="py-20 px-6 md:px-12">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">For employers & policymakers</h3>
              <p className="text-neutral-700 mb-6">
                Search verified candidates by skill, NSQF level, and employer-validated credentials. Access anonymized national skill trends to inform training priorities.
              </p>

              <ul className="space-y-3 text-neutral-700">
                <li className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-green-600 text-neutral-900 font-bold">1</span>
                  <span>Fast verification API for background checks</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-green-600 text-neutral-900 font-bold">2</span>
                  <span>Role-based access and consent-driven data sharing</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-green-600 text-neutral-900 font-bold">3</span>
                  <span>Dashboards for workforce planning and NSQF-aligned analytics</span>
                </li>
              </ul>

              <div className="mt-6">
                <Link className="inline-block py-3 px-5 rounded-lg border-2 border-neutral-900 font-medium hover:bg-neutral-900 hover:text-white transition" href="/employer">
                  Employer access
                </Link>
              </div>
            </div>

            <div className="bg-neutral-900 text-white p-8 rounded-xl shadow-lg">
              <h4 className="text-xl font-semibold mb-4">National skill snapshot</h4>
              <div className="space-y-4">
                <StatRow label="Verified credentials" value="124,512" />
                <StatRow label="Active learners" value="42,903" />
                <StatRow label="Top skill" value="Data Analysis" />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials / Social proof */}
        <section className="bg-white/40 py-16 px-6 md:px-12">
          <div className="max-w-5xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-6">Trusted by learners and institutions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Testimonial name="Riya P." role="Data Analyst, Bengaluru" quote="The platform made sharing verified credentials so easy — recruiters loved the NSQF mapping." />
              <Testimonial name="National Skills Board" role="Partner" quote="Integration with DigiLocker and clear provenance helped our verification workflows." />
              <Testimonial name="Coursera (pilot)" role="Issuing Partner" quote="Seamless API ingestion and clear metadata reduced manual checks by 80%." />
            </div>
          </div>
        </section>

        <section className="py-16 px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-green-900 via-green-800 to-green-900 text-white rounded-2xl p-10 shadow-2xl">
            <h3 className="text-3xl font-bold mb-4">Create your verified skills portfolio</h3>
            <p className="mb-6 text-neutral-100">Start aggregating your micro-credentials and showcase a trusted, NSQF-aligned profile to employers.</p>

            <div className="flex justify-center gap-4">
              <Link  className="py-3 px-6 rounded-lg bg-white text-green-900 font-semibold hover:scale-[1.02] transition" href="/signin">
                Get started
              </Link>

              <Link className="py-3 px-6 rounded-lg border-2 border-white font-medium" href="/about">
                Learn more
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}



function FeatureCard({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="w-12 h-12 mb-4 flex items-center justify-center rounded-md bg-gradient-to-br from-green-600 to-green-800 text-neutral-900 font-bold">
        {icon}
      </div>
      <h4 className="font-semibold text-lg mb-2">{title}</h4>
      <p className="text-sm text-neutral-600">{desc}</p>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
      <div className="text-sm text-neutral-200">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

function Testimonial({ name, role, quote }: { name: string; role: string; quote: string }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm text-left">
      <p className="text-neutral-700 mb-4">“{quote}”</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-700 text-neutral-900 flex items-center justify-center font-bold">{name?.[0] ?? "A"}</div>
        <div>
          <div className="text-sm font-semibold">{name}</div>
          <div className="text-xs text-neutral-500">{role}</div>
        </div>
      </div>
    </div>
  );
}



/* --------------------------- Small SVG icons --------------------------- */
function SvgStack() {
  return (
    <svg className="text-green-100" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L3 7l9 5 9-5-9-5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 13l9 5 9-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 18l9 5 9-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SvgShield() {
  return (
    <svg className="text-green-100" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2l7 4v6c0 5-3.6 9.7-7 10-3.4-.3-7-5-7-10V6l7-4z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 12.5l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SvgSpark() {
  return (
    <svg className="text-green-100" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 22v-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 12h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 12h-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
