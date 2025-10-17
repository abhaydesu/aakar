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

    // Initial fetch
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
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 shadow">
        <h3 className="font-semibold mb-3 pb-4 border-b ">
          <span className='text-neutral-200 rounded-xl bg-green-800 py-2 px-4'>Inbox</span>
          </h3>
        {partners.length === 0 ? (
          <div className="text-sm text-neutral-600">No conversations yet.</div>
        ) : (
          <div className="space-y-2">
            {partners.map((p) => (
              <button
                key={p.partnerId}
                onClick={() => setSelectedPartner(p.partnerId)}
                className="w-full text-left flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-green-50 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-700 text-white flex items-center justify-center font-bold">
                    {p.latest.text?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                  <div>
                    <div className="font-medium text-neutral-700">User {p.partnerId.slice(-6)}</div>
                    <div className="text-sm text-neutral-600 truncate max-w-[22rem]">{p.latest.text}</div>
                  </div>
                </div>
                <div className="text-xs text-neutral-500">{new Date(p.latest.createdAt).toLocaleString()}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedPartner && (
        <div className="bg-white rounded-2xl p-4 shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold text-neutral-800">Conversation</div>
            <button onClick={() => setSelectedPartner(null)} className="text-neutral-600 border border-neutral-600 hover:border-red-500 hover:text-red-500 py-2 px-4 rounded-lg cursor-pointer">Close</button>
          </div>
          <ChatBox toUserId={selectedPartner} currentUserId={currentUserId} />
        </div>
      )}
    </div>
  );
}
