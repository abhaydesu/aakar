'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import TECHS from '@/lib/tech';
import toast from 'react-hot-toast';

type SearchResult = {
  id: string;
  name: string;
  email: string;
  image?: string;
  role?: string;
  matchCount: number;
};

export default function RecruiterDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [chatOpenFor, setChatOpenFor] = useState<SearchResult | null>(null);
  const [chatText, setChatText] = useState('');
  const [lastSentAt, setLastSentAt] = useState<number>(0);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
      return;
    }
    if (status === 'authenticated') {
      const role = session?.user?.role;
      if (!role) {
        router.push('/select-role');
        return;
      }
      if (role !== 'recruiter') {
        router.push('/dashboard');
        return;
      }
    }
  }, [status, session, router]);

  const techOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TECHS.slice(0, 40); 
    return TECHS.filter((t) => t.toLowerCase().includes(q)).slice(0, 50);
  }, [query]);

  const toggleTech = (tech: string) => {
    setSelectedTechs((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech].slice(0, 12)
    );
  };

  const doSearch = async () => {
    if (selectedTechs.length === 0) {
      toast.error('Select at least one technology to search.');
      return;
    }
    setIsSearching(true);
    setResults([]);
    try {
      const res = await fetch('/api/search/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ techs: selectedTechs, limit: 50 }),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        // eslint-disable-next-line no-console
        console.error('Search failed', res.status, txt);
        toast.error('Search failed. Check console.');
      } else {
        const data: SearchResult[] = await res.json();
        setResults(data);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Search error', err);
      toast.error('Network error during search.');
    } finally {
      setIsSearching(false);
    }
  };

  const openChat = (user: SearchResult) => {
    setChatOpenFor(user);
    setChatText(`Hi ${user.name}, I’m interested in your profile for ${selectedTechs.join(', ')}.`);
  };

  const sendChat = async () => {
    if (!chatOpenFor) return;
    if (!chatText.trim()) {
      toast.error('Please enter a message.');
      return;
    }
    const now = Date.now();
    if (now - lastSentAt < 800) return;
    setLastSentAt(now);

    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ toUserId: chatOpenFor.id, text: chatText }),
      });
      if (res.ok) {
        toast.success('Message sent');
        setChatOpenFor(null);
        setChatText('');
      } else {
        const txt = await res.text().catch(() => '');
        // eslint-disable-next-line no-console
        console.error('Send chat failed', res.status, txt);
        toast.error('Failed to send message.');
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Send chat error', err);
      toast.error('Network error while sending message.');
    }
  };

  return (
    <main className="min-h-screen bg-[#f9f0eb] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-neutral-900">Recruiter — Find candidates</h1>
            <p className="text-sm text-neutral-600">Search and message candidates by technology stack.</p>
          </div>
        </div>

        <section className="bg-white rounded-2xl p-6 shadow mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <div className="w-full md:w-2/3">
              <label className="text-sm font-medium text-neutral-700">Filter techs</label>
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search techs..."
                  className="w-full md:w-1/3 bg-[#f3efe8] border border-neutral-300 rounded-lg p-2 focus:outline-none"
                />
                <button onClick={() => { setQuery(''); }} type="button" className="px-3 py-2 rounded-md bg-neutral-100 border border-neutral-200">Clear</button>
              </div>

              <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-56 overflow-auto pr-2">
                {techOptions.map((tech) => {
                  const active = selectedTechs.includes(tech);
                  return (
                    <button key={tech} type="button" onClick={() => toggleTech(tech)} className={`text-sm px-2 py-1 rounded-full border transition ${active ? 'bg-green-800 text-white' : 'bg-[#f3efe8] text-neutral-800'}`}>
                      {tech}
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 text-sm text-neutral-600">Selected: {selectedTechs.length} (max 12)</div>
            </div>

            <div className="w-full md:w-1/3 flex flex-col gap-2">
              <label className="text-sm font-medium text-neutral-700">Actions</label>
              <button onClick={doSearch} disabled={isSearching} type="button" className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-800 text-white font-semibold px-4 py-3 shadow disabled:opacity-50">
                {isSearching ? 'Searching...' : 'Search candidates'}
              </button>

              <button onClick={() => { setSelectedTechs([]); setResults([]); }} type="button" className="inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-100 text-neutral-900 font-medium px-4 py-3 shadow">
                Reset
              </button>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Results</h2>

          {isSearching && <div className="text-sm text-neutral-600 mb-4">Searching...</div>}

          {results.length === 0 ? (
            <div className="text-neutral-600">No results yet. Run a search to find candidates.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((r) => (
                <div key={r.id} className="bg-white rounded-2xl p-4 shadow flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-green-700 text-white flex items-center justify-center text-lg font-bold">{r.name?.[0] ?? 'U'}</div>
                    <div>
                      <div className="font-semibold text-neutral-900">{r.name}</div>
                      <div className="text-sm text-neutral-600">{r.email}</div>
                      <div className="text-xs text-neutral-500 mt-1">Matches: {r.matchCount}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => openChat(r)} type="button" className="px-3 py-2 rounded-md bg-neutral-900 text-white font-medium">Chat</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {chatOpenFor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-semibold">{chatOpenFor.name}</div>
                <div className="text-sm text-neutral-600">{chatOpenFor.email}</div>
              </div>
              <button type="button" onClick={() => setChatOpenFor(null)} className="text-neutral-600">Close</button>
            </div>

            <textarea value={chatText} onChange={(e) => setChatText(e.target.value)} rows={6} className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none mb-4" />

            <div className="flex items-center justify-end gap-3">
              <button type="button" onClick={() => setChatOpenFor(null)} className="px-4 py-2 rounded-md bg-neutral-100">Cancel</button>
              <button type="button" onClick={sendChat} className="px-4 py-2 rounded-md bg-green-800 text-white">Send message</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
