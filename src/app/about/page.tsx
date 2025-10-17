// src/app/about/page.tsx
import React from 'react';

export default function AboutPage() {
  return (
    <div className="bg-[#f9f0eb] text-neutral-900 min-h-screen">
      <main className="max-w-6xl mx-auto px-6 py-12">
        <section className=" bg-white rounded-xl p-10 gap-8 items-center mb-12">
          <div className="">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">About Aakar</h1>
            <p className="text-lg text-neutral-700 mb-6">
              Aakar is a Micro-Credential Aggregator Platform designed to help learners collect, verify, and showcase
              short-term learning achievements from multiple providers in a single, trusted digital portfolio.
            </p>

            <p className="text-neutral-700 mb-4">
              Built to align with the National Skills Qualifications Framework (NSQF), Aakar brings together issuer
              integrations, verification mechanisms (DigiLocker / NCVET / blockchain), and AI-assisted normalization to
              create a reliable skills record for learners, employers, and policymakers.
            </p>
          </div>
        </section>

        <section className="mb-12">
  <h2 className="text-3xl font-bold mb-4">The Problem</h2>
  <p className="text-neutral-700 mb-4">
    Learners accumulate micro-credentials across many platforms, but these credentials remain scattered, hard to verify, and often lack interoperability. This fragmentation wastes effort, raises doubts about authenticity, and prevents skill recognition at scale.
  </p>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
    <StatCard title="Institutions offering credit-bearing credentials" value="52 %" />
    <StatCard title="Employers valuing micro-credentials" value="96 %" />
    <StatCard title="Credential / employment fraud in India" value="~9 %" />
  </div>

  <p className="text-sm text-neutral-500 mt-4 italic">
    Sources:  <br />
    • 52 % of Indian HEIs currently offer micro-credentials for academic credit (Coursera Impact Report) :contentReference[oaicite:0]<br />
    • Globally, 96 % of employers say micro-credentials strengthen a candidate&apos;s job application :contentReference[oaicite:1] <br />
    • Studies report ~9 % of qualification/experience documents flagged for fraud in India (e.g. Chennai / Bengaluru region) :contentReference[oaicite:2]
  </p>
</section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Our values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ValueCard title="Trust first" desc="Provenance and verification are core — every credential stores its source and verification tier." />
            <ValueCard title="Inclusive design" desc="Accessible interfaces, multilingual support, and NSQF mapping to keep opportunities open." />
            <ValueCard title="Open interoperability" desc="Pluggable adapters and open APIs so learning providers can integrate easily." />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Team HEXADECIMAL</h2>
          <p className="text-neutral-700 mb-6">Core contributors building Aakar for SIH25202.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <TeamMember name="Kushagra Shukla" role="Team Leader/Full Stack Developer"  />
            <TeamMember name="Abhay Singh" role="Full Stack Developer"/>
            <TeamMember name="Angelica Singh" role="Frontend Developer"/>
            <TeamMember name="Aditya" role="Backend Developer" />
            <TeamMember name="Abhimanyu Dutta" role="Python Developer"/>
            <TeamMember name="Prajakta Naik" role="DevOps" />
          </div>
        </section>

        <section className="mb-12 bg-gradient-to-r from-green-900 via-green-700 to-green-900 text-white rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-2">Join our mission</h3>
          <p className="mb-4">Partner with us — whether you&apos;re a learning provider, employer, or policymaker.</p>
          <a className="inline-block py-3 px-6 rounded-lg bg-white text-green-900 font-semibold" href="/contact">Get in touch</a>
        </section>

      </main>

    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="text-sm text-neutral-500">{title}</div>
      <div className="text-2xl font-semibold mt-2">{value}</div>
    </div>
  );
}

function ValueCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-sm text-neutral-600">{desc}</p>
    </div>
  );
}

function TeamMember({ name, role }: { name: string; role: string; }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-green-700 text-neutral-900 flex items-center justify-center font-bold">{name?.[0] ?? 'A'}</div>
        <div>
          <div className="font-semibold">{name}</div>
          <div className="text-xs text-neutral-500">{role}</div>
        </div>
      </div>
    </div>
  );
}

function TechCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h4 className="font-semibold mb-3">{title}</h4>
      <ul className="text-sm text-neutral-600 list-disc list-inside space-y-1">
        {items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    </div>
  );
}
