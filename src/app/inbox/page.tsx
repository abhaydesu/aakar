'use client';
import Inbox from '../components/chat/Inbox';

export default function InboxPage() {
  return (
    <main className="min-h-screen bg-[#f9f0eb] p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-neutral-900 mb-6">Messages</h1>
        <Inbox />
      </div>
    </main>
  );
}
