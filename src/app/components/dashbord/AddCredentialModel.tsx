import { FormEvent } from 'react';

type AddCredentialModalProps = {
  onClose: () => void;
  onAddCredential: (formData: FormData) => void;
};

export const AddCredentialModal = ({ onClose, onAddCredential }: AddCredentialModalProps) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onAddCredential(formData);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Add credential modal"
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div className="w-full max-w-lg bg-white rounded-sm  shadow-lg p-6 text-neutral-900">
        <header className="mb-4">
          <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-700">
              Add New
            </span>{' '}
            <span className="text-green-300">Credential</span>
          </h2>
          <p className="text-sm text-neutral-600 mt-1">Upload your certificate and fill the details below.</p>
        </header>

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <label className="text-sm text-neutral-700">Course title</label>
            <input
              required
              name="title"
              type="text"
              placeholder="e.g. Introduction to Machine Learning"
              className="w-full bg-neutral-100 border border-neutral-200 rounded-sm  p-3 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-green-200"
            />

            <label className="text-sm text-neutral-700">Issuing organization</label>
            <input
              required
              name="issuer"
              type="text"
              placeholder="e.g. Coursera"
              className="w-full bg-neutral-100 border border-neutral-200 rounded-sm  p-3 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-green-200"
            />

            <label className="text-sm text-neutral-700">Date</label>
            <input
              required
              name="date"
              type="date"
              className="w-full bg-neutral-100 border border-neutral-200 rounded-sm  p-3 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-green-200"
            />

            <label className="text-sm text-neutral-700">Skills (comma-separated)</label>
            <input
              required
              name="skills"
              type="text"
              placeholder="e.g. Python, Machine Learning, SQL"
              className="w-full bg-neutral-100 border border-neutral-200 rounded-sm  p-3 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </div>

          <div>
            <label htmlFor="certificate" className="block text-sm font-medium text-neutral-700 mb-2">
              Certificate (required)
            </label>
            <input
              required
              name="certificate"
              id="certificate"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-sm  file:border-0 file:text-sm file:font-semibold
                         file:bg-green-200 file:text-neutral-900 hover:file:bg-green-300"
            />
            <p className="text-xs text-neutral-500 mt-1">Accepted: PDF, PNG, JPG — max 10MB</p>
          </div>

          <footer className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-sm  bg-neutral-100 text-neutral-900 border border-neutral-200 hover:brightness-95"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-sm  bg-neutral-900 text-[#f9f0eb] font-semibold shadow-sm hover:scale-[1.02] transition-transform"
            >
              Add credential
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};
