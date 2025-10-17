'use client';

import React from 'react';

export default function CopyProfileLinkButton() {
  const handleClick = async () => {
    try {
      if (typeof window !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch {
      // no-op
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="text-sm px-3 py-1 rounded-full bg-neutral-900 text-white hover:bg-green-800 transition-colors"
      aria-label="Copy profile link"
    >
      Copy profile link
    </button>
  );
}
