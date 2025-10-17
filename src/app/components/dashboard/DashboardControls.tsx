"use client";

import { useEffect, useRef, useState } from 'react';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Link as LinkIcon } from 'lucide-react';

type DashboardControlsProps = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isGrouped: boolean;
  onGroupToggle: () => void;
  onAddClick: () => void;
};

export const DashboardControls = ({
  searchQuery,
  onSearchChange,
  isGrouped,
  onGroupToggle,
  onAddClick,
}: DashboardControlsProps) => {
  const { data: session, status } = useSession();
  const [slug, setSlug] = useState<string>('');
  const [isLoadingSlug, setIsLoadingSlug] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchSlug = async () => {
      if (status !== 'authenticated') return;
      setIsLoadingSlug(true);
      try {
        const res = await fetch('/api/user/slug');
        if (res.ok) {
          const data = await res.json().catch(() => ({} as { slug?: string | null }));
          if (mounted && data?.slug) setSlug(String(data.slug));
        }
      } catch (err) {
        console.error('Failed to fetch slug:', err);
      } finally {
        if (mounted) setIsLoadingSlug(false);
      }
    };
    fetchSlug();
    return () => {
      mounted = false;
      if (copyTimeoutRef.current) window.clearTimeout(copyTimeoutRef.current);
    };
  }, [status]);
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl md:text-4xl font-extrabold text-neutral-900">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-700">
                My Skill Portfolio
              </span>
            </h1>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const idToCopy = slug;
                  if (!idToCopy) return;
                  if (typeof navigator !== 'undefined' && navigator.clipboard) {
                    void navigator.clipboard.writeText(`${location.origin}/profile/${idToCopy}`).then(() => {
                      setCopied(true);
                      toast.success('Public link copied');
                      if (copyTimeoutRef.current) window.clearTimeout(copyTimeoutRef.current);
                      copyTimeoutRef.current = window.setTimeout(() => setCopied(false), 1500);
                    });
                  }
                }}
                disabled={!slug || isLoadingSlug}
                aria-label="Copy public profile link"
                className="p-1 rounded-md bg-green-50 text-green-700 hover:bg-green-100 active:translate-y-0.5 active:scale-95 transition-transform duration-100"
              >
                <LinkIcon size={18} />
              </button>

              <span aria-live="polite" className={`text-sm font-medium text-green-700 transition-opacity duration-200 ${copied ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}>
                {copied ? 'Copied!' : ''}
              </span>
            </div>
          </div>
          <p className="text-sm text-neutral-600 mt-1">
            A unified view of all your micro-credentials.
          </p>
        </div>

        <div className="flex items-center gap-3">
  <button
    onClick={onAddClick}
    className="inline-flex items-center bg-neutral-900 hover:scale-[1.02] text-[#f9f0eb] font-semibold py-2.5 px-4 rounded-sm transition-transform border-4 border-transparent"
  >
    <FiPlus className="-ml-1 mr-2" />
    Add New
  </button>

  <button
    onClick={onGroupToggle}
    className="py-2.5 px-4 rounded-sm bg-green-800 text-neutral-100 font-medium
               border-4 border-transparent transition-colors duration-150 transform-gpu will-change-transform
               hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-800 cursor-pointer"
    aria-pressed={isGrouped}
  >
    {isGrouped ? 'Show All' : 'Group Duplicates'}
  </button>
</div>
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-transparent flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by skill, title, issuer..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-200 rounded-lg py-3 pl-10 pr-4 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-green-800"
            aria-label="Search credentials"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onSearchChange('')}
            className="px-3 py-2 rounded-md bg-neutral-100 text-neutral-900 border border-neutral-200 hover:bg-green-100 cursor-pointer"
            title="Clear search"
          >
            Clear
          </button>
        </div>
      </div>
    </>
  );
};