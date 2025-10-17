import Link from "next/link"
import Image from "next/image"


export function Footer() {

  return (
    <footer className="bg-neutral-900 text-neutral-100">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-md bg-green-600 flex items-center justify-center font-bold text-neutral-900">
                <Image src="/logo2.png" width={50} height={50} alt="logo" />
            </div>
            <div>
              <div className="font-semibold text-lg">Aakar</div>
              <div className="text-xs text-neutral-300">Micro-credential aggregator</div>
            </div>
          </div>
          <p className="text-xs text-neutral-400">Built for Skill India initiatives — secure, verifiable and NSQF-aligned.</p>
        </div>

        <div>
          <h5 className="font-semibold mb-3">Product</h5>
          <ul className="space-y-2 text-sm text-neutral-300">
            <li><Link href="/dashboard">Dashboard</Link></li>
            <li><Link href="/about">How it works</Link></li>
            <li><Link href="/dashboard">Employer access</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-semibold mb-3">Contact</h5>
          <p className="text-sm text-neutral-300">hello@aakar.example</p>
          <p className="text-sm text-neutral-300">Ministry of Skill Development & Entrepreneurship</p>
        </div>
      </div>

      <div className="border-t border-white/10 text-xs text-neutral-400 text-center py-4">© {new Date().getFullYear()} Aakar — All rights reserved</div>
    </footer>
  )
};