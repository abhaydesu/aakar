'use client';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

type Message = {
  _id?: string;
  fromUserId: string;
  toUserId: string;
  text: string;
  createdAt: string;
  read?: boolean;
};

export default function ChatBox({ toUserId, currentUserId }: { toUserId: string; currentUserId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const lastUpdate = useRef<string>(new Date(0).toISOString());
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    lastUpdate.current = new Date(0).toISOString();
    setMessages([]);
    const fetchInitial = async () => {
      try {
        const res = await fetch('/api/chat/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ since: lastUpdate.current }),
          credentials: 'include',
        });
        if (res.ok) {
          const msgs: Message[] = await res.json();
          const conv = msgs.filter(m => (m.fromUserId === toUserId && m.toUserId === currentUserId) || (m.fromUserId === currentUserId && m.toUserId === toUserId));
          if (conv.length > 0) {
            lastUpdate.current = conv[conv.length - 1].createdAt;
            setMessages(conv);
            requestAnimationFrame(() => {
              const c = scrollContainerRef.current;
              if (c) c.scrollTo({ top: c.scrollHeight, behavior: 'smooth' });
            });
          }
        }
      } catch (err) {
        // silent
      }
    };
    fetchInitial();
    const iv = setInterval(async () => {
      try {
        const res = await fetch('/api/chat/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ since: lastUpdate.current }),
          credentials: 'include',
        });
        if (!res.ok) return;
        const newMsgs: Message[] = await res.json();
        const conv = newMsgs.filter(m => (m.fromUserId === toUserId && m.toUserId === currentUserId));
        if (conv.length > 0) {
          lastUpdate.current = conv[conv.length - 1].createdAt;
          setMessages(prev => {
            const merged = [...prev, ...conv];
            requestAnimationFrame(() => {
              const c = scrollContainerRef.current;
              if (c) c.scrollTo({ top: c.scrollHeight, behavior: 'smooth' });
            });
            return merged;
          });
        }
      } catch (err) {
        // silent
      }
    }, 2200);
    return () => clearInterval(iv);
  }, [toUserId, currentUserId]);

  const handleSend = async () => {
    if (!input.trim() || isSending) return;
    setIsSending(true);
    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toUserId, text: input }),
        credentials: 'include',
      });
      if (res.ok) {
        const newMessage: Message = {
          fromUserId: currentUserId,
          toUserId,
          text: input,
          createdAt: new Date().toISOString(),
          read: false,
        };
        setMessages(prev => {
          const next = [...prev, newMessage];
          requestAnimationFrame(() => {
            const c = scrollContainerRef.current;
            if (c) c.scrollTo({ top: c.scrollHeight, behavior: 'smooth' });
          });
          return next;
        });
        setInput('');
      } else {
        toast.error('Failed to send message.');
      }
    } catch (err) {
      toast.error('Network error while sending message.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-2xl shadow p-4 flex flex-col h-[500px]">
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto space-y-2 mb-4 px-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg max-w-[70%] break-words ${
              msg.fromUserId === currentUserId
                ? 'ml-auto bg-green-100 text-green-900'
                : 'mr-auto bg-neutral-100 text-neutral-800'
            }`}
          >
            <div className="text-sm">{msg.text}</div>
            <div className="text-xs text-neutral-500 mt-1 text-right">{new Date(msg.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <button
          onClick={handleSend}
          disabled={isSending}
          className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 disabled:bg-amber-300"
        >
          Send
        </button>
      </div>
    </div>
  );
}
