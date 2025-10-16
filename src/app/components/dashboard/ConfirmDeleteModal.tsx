import { useState, useEffect } from 'react';
import { Credential } from '@/types';

type ConfirmDeleteModalProps = {
  credential: Credential | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
};

export const ConfirmDeleteModal = ({ credential, onClose, onConfirm }: ConfirmDeleteModalProps) => {
  const [confirmText, setConfirmText] = useState('');

  useEffect(() => {
    if (credential) setConfirmText('');
  }, [credential]);

  if (!credential) return null;

  const isMatch = confirmText.trim() === credential.title;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Confirm delete credential"
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div className="w-full max-w-md bg-white rounded-sm shadow-lg p-6 text-neutral-900">
        <header className="mb-3">
          <h3 className="text-2xl font-extrabold text-red-500">Confirm deletion</h3>
          <p className="text-sm text-neutral-600 mt-1">
            This action cannot be undone. Type the credential title to confirm.
          </p>
        </header>

        <div className="mb-4">
          <div className="inline-block bg-neutral-100 text-neutral-900 px-3 py-2 rounded-sm font-semibold break-words">
            {credential.title}
          </div>
        </div>

        <div>
          <label className="block text-sm text-neutral-700 mb-2">Type the full title to confirm</label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Paste or type the exact title"
            className="w-full bg-neutral-100 border border-neutral-200 rounded-sm p-3 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-200"
          />
        </div>

        <footer className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-sm bg-neutral-100 text-neutral-900 border border-neutral-200 hover:brightness-95"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onConfirm(credential.id)}
            disabled={!isMatch}
            className={
              `px-4 py-2 rounded-sm font-semibold text-white transition-colors ` +
              (isMatch
                ? 'bg-red-600 hover:bg-red-500'
                : 'bg-red-900/50 cursor-not-allowed')
            }
          >
            Delete
          </button>
        </footer>
      </div>
    </div>
  );
};
