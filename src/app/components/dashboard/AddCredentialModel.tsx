'use client';
import React, { useMemo, useState } from 'react';
import TECHS from '@/lib/tech';

type Props = {
  onClose: () => void;
  onAddCredential: (formData: FormData) => void;
};

export const AddCredentialModal: React.FC<Props> = ({ onClose, onAddCredential }) => {
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [date, setDate] = useState('');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const techOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TECHS.slice(0, 50);
    return TECHS.filter((t) => t.toLowerCase().includes(q)).slice(0, 100);
  }, [query]);

  const toggleTech = (tech: string) => {
    setSelected((prev) =>
      prev.includes(tech)
        ? prev.filter((t) => t !== tech)
        : [...prev, tech].slice(0, 12)
    );
  };

  const handleFile = (f?: File | null) => {
    if (!f) return setFile(null);
    setFile(f);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;
    if (!title.trim() || !issuer.trim() || !date.trim()) {
      alert('Please fill title, issuer and date.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('issuer', issuer.trim());
    formData.append('date', date);
    formData.append('skills', selected.join(','));
    if (file) formData.append('certificate', file);

    setIsSubmitting(true);
    try {
      await onAddCredential(formData);
      setTitle('');
      setIssuer('');
      setDate('');
      setSelected([]);
      setFile(null);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to add credential.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white rounded-2xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Add Credential</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-600 px-4 py-2 rounded-lg  cursor-pointer hover:text-red-700 hover:border-red-700 border  border-neutral-600"
          >
            Close
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="text-sm font-medium text-neutral-700">Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 p-3 rounded-lg border border-neutral-200 bg-[#f3efe8] focus:outline-none"
              required
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-medium text-neutral-700">Issuer</span>
            <input
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              className="mt-1 p-3 rounded-lg border border-neutral-200 bg-[#f3efe8] focus:outline-none"
              required
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-medium text-neutral-700">Date</span>
            <input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              type="date"
              className="mt-1 p-3 rounded-lg border border-neutral-200 bg-[#f3efe8] focus:outline-none"
              required
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-medium text-neutral-700 ">Certificate (optional)</span>
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={(e) =>
                handleFile(e.target.files ? e.target.files[0] : null)
              }
              className="mt-1 border border-neutral-300 bg-neutral-100 cursor-pointer hover:bg-neutral-200 p-3 rounded-lg text-green-800/70"
            />
            {file && (
              <div className="text-xs text-neutral-600 mt-1">{file.name}</div>
            )}
          </label>
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-neutral-700">
            Skills / Technologies
          </label>

          <div className="mt-2 flex items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search techs..."
              className="flex-1 p-2 rounded-md border border-neutral-200 bg-[#f3efe8] focus:outline-none"
            />
            <div className="text-sm text-neutral-500">
              Selected: {selected.length}
            </div>
          </div>

          <div className="mt-3 max-h-40 overflow-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 pr-2">
            {techOptions.map((tech) => {
              const active = selected.includes(tech);
              return (
                <button
                  key={tech}
                  type="button"
                  onClick={() => toggleTech(tech)}
                  className={`text-sm px-2 py-1 rounded-full border transition cursor-pointer ${
                    active
                      ? 'bg-green-800/70 text-white'
                      : 'bg-[#f3efe8] text-neutral-800 hover:bg-[#fffcf3]'
                  }`}
                >
                  {tech.toLowerCase()}
                </button>
              );
            })}
          </div>

          {selected.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {selected.map((s) => (
                <div
                  key={s}
                  className="inline-flex items-center gap-2 bg-neutral-100 px-3 py-1 rounded-full text-sm "
                >
                  <span>{s}</span>
                  <button
                    type="button"
                    onClick={() => toggleTech(s)}
                    className="text-green-700 hover:text-red-700 cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-neutral-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded-md bg-green-800 text-white font-semibold"
          >
            {isSubmitting ? 'Saving...' : 'Add Credential'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCredentialModal;
