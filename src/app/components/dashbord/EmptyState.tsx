import { FiPlus } from 'react-icons/fi';

type EmptyStateProps = {
  onAddClick: () => void;
};

export const EmptyState = ({ onAddClick }: EmptyStateProps) => {
  return (
    <div className="text-center bg-white rounded-2xl p-8 shadow-sm border border-transparent max-w-xl">
      <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900">Your Portfolio is Empty</h2>
      <p className="mt-2 text-neutral-600">
        Get started by adding your first micro-credential.
      </p>
      <div className="mt-6">
        <button
          onClick={onAddClick}
          className="inline-flex items-center bg-neutral-900 hover:scale-[1.02] text-[#f9f0eb] font-semibold py-3 px-6 rounded-sm transition-transform"
        >
          <FiPlus className="-ml-1 mr-2" />
          Add Your First Credential
        </button>
      </div>
    </div>
  );
};
