import { useState, useEffect } from 'react';
import { Credential } from '@/types';

type ConfirmDeleteModalProps = {
  credential: Credential | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
};

export const ConfirmDeleteModal = ({ credential, onClose, onConfirm }: ConfirmDeleteModalProps) => {
  const [confirmText, setConfirmText] = useState('');

  // Reset input when the modal opens for a new item
  useEffect(() => {
    if (credential) {
      setConfirmText('');
    }
  }, [credential]);

  if (!credential) return null;

  const isMatch = confirmText === credential.title;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md m-4">
        <h2 className="text-2xl font-bold mb-2 text-red-400">Confirm Deletion</h2>
        <p className="text-gray-300 mb-4">
          This action cannot be undone. To confirm, please type the full title of the credential:
        </p>
        <p className="text-white font-semibold bg-gray-900 p-2 rounded-md mb-4 break-words">
          {credential.title}
        </p>
        
        <input 
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        
        <div className="mt-6 flex justify-end space-x-4">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500">
            Cancel
          </button>
          <button 
            type="button" 
            onClick={() => onConfirm(credential.id)}
            disabled={!isMatch}
            className="px-4 py-2 rounded bg-red-600 font-semibold text-white transition-colors disabled:bg-red-900/50 disabled:cursor-not-allowed hover:bg-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};