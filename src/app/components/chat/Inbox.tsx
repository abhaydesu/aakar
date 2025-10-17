'use client';
import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import ChatBox from './ChatBox';
import toast from 'react-hot-toast';

type Msg = {
  _id?: string;
  fromUserId: string;
  toUserId: string;
  text: string;
  createdAt: string;
  read?: boolean;
};

export default function Inbox() {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [lastFetch, setLastFetch] = useState<string>(new Date(0).toISOString());
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const currentUserId = session?.user?.id ?? null;

  useEffect(() => {
    if (status !== 'authenticated' || !currentUserId) return;
    let mounted = true;

    const fetchNew = async () => {
      try {
        const res = await fetch('/api/chat/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ since: lastFetch }),
        });
        if (!res.ok) return;
        const newMsgs: Msg[] = await res.json();
        if (!mounted || !newMsgs.length) return;
        setMessages(prev => [...prev, ...newMsgs]);
        setLastFetch(newMsgs[newMsgs.length - 1].createdAt);
      } catch (err) {}
    };

    (async () => {
      const r = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ since: new Date(0).toISOString() }),
      });
      if (r.ok) {
        const all: Msg[] = await r.json();
        if (!mounted || !all.length) return;
        setMessages(all);
        setLastFetch(all[all.length - 1].createdAt);
      }
    })();

    const iv = setInterval(fetchNew, 3000);
    return () => {
      mounted = false;
      clearInterval(iv);
    };
  }, [status, currentUserId, lastFetch]);

  const partners = useMemo(() => {
    const map = new Map<string, Msg[]>();
    for (const m of messages) {
      const partnerId = m.fromUserId === currentUserId ? m.toUserId : m.fromUserId;
      if (!partnerId) continue;
      if (!map.has(partnerId)) map.set(partnerId, []);
      map.get(partnerId)!.push(m);
    }
    const list = Array.from(map.entries()).map(([partnerId, msgs]) => {
      const sorted = msgs.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      return { partnerId, latest: sorted[sorted.length - 1] };
    });
    return list.sort((a, b) => new Date(b.latest.createdAt).getTime() - new Date(a.latest.createdAt).getTime());
  }, [messages, currentUserId]);

  if (status === 'loading' || !currentUserId) {
    return <div className="text-neutral-600">Loading inbox...</div>;
  }

  return (
<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
  <div
    className={`bg-white rounded-2xl p-4 shadow ${
      selectedPartner ? 'hidden' : 'block'
    } md:block md:col-span-1 lg:col-span-1`}
  >
    <h3 className="font-semibold mb-3 pb-3 border-b text-neutral-800">
      Inbox
    </h3>
    {partners.length === 0 ? (
      <div className="text-sm text-neutral-600 p-2">No conversations yet.</div>
    ) : (
      <div className="space-y-1">
        {partners.map((p) => (
          <button
            key={p.partnerId}
            onClick={() => setSelectedPartner(p.partnerId)}
            className={`w-full text-left flex items-center gap-3 p-2 rounded-lg transition-colors duration-150 ${
              selectedPartner === p.partnerId ? 'bg-green-100' : 'hover:bg-green-50'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-green-700 text-white flex items-center justify-center font-bold flex-shrink-0">
              {p.latest.text?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="flex-grow overflow-hidden">
              <div className="flex justify-between items-baseline">
                <div className="font-medium text-neutral-800 truncate">
                  User {p.partnerId.slice(-6)}
                </div>
                <div className="text-xs text-neutral-500 flex-shrink-0 ml-2">
                  {new Date(p.latest.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <div className="text-sm text-neutral-600 truncate">
                {p.latest.text}
              </div>
            </div>
          </button>
        ))}
      </div>
    )}
  </div>

  <div
    className={`bg-white rounded-2xl p-4 shadow ${
      !selectedPartner ? 'hidden' : 'block'
    } md:block md:col-span-2 lg:col-span-3`}
  >
    {selectedPartner ? (
      <>
        <div className="flex items-center justify-between pb-3 border-b mb-4">
            <button onClick={() => setSelectedPartner(null)} className="md:hidden p-2 -ml-2 text-neutral-600 hover:text-neutral-900">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <div className="font-semibold text-neutral-800 ">
              Conversation with User {selectedPartner.slice(-6)}
            </div>
        </div>
        <ChatBox toUserId={selectedPartner} currentUserId={currentUserId} />
      </>
    ) : (
      <div className="hidden md:flex h-full items-center justify-center">
        <div className="text-center text-neutral-500">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 5.523-4.477 10-10 10S1 17.523 1 12 5.477 2 11 2s10 4.477 10 10z"></path></svg>
            <p className="mt-2">Select a conversation to start chatting.</p>
        </div>
      </div>
    )}
  </div>
</div>
  );
}
