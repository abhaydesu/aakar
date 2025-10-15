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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md m-4">
        <h2 className="text-2xl font-bold mb-4">Add New Credential</h2>
        {/* FIX: Added the missing encType property to the form */}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="space-y-4">
            <input required name="title" type="text" placeholder="Course Title" className="w-full bg-gray-700 p-2 rounded border-gray-600"/>
            <input required name="issuer" type="text" placeholder="Issuing Organization" className="w-full bg-gray-700 p-2 rounded border-gray-600"/>
            <input required name="date" type="date" className="w-full bg-gray-700 p-2 rounded border-gray-600"/>
            <input required name="skills" type="text" placeholder="Skills (comma-separated)" className="w-full bg-gray-700 p-2 rounded border-gray-600"/>
            <div>
              <label htmlFor="certificate" className="block text-sm font-medium text-gray-300 mb-1">
                Certificate (Required)
              </label>
              <input 
                required 
                name="certificate" 
                id="certificate" 
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-500/10 file:text-blue-300 hover:file:bg-blue-500/20"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500">Add Credential</button>
          </div>
        </form>
      </div>
    </div>
  );
};