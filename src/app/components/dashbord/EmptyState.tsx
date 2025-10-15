import { FiPlus } from 'react-icons/fi';

type EmptyStateProps = {
  onAddClick: () => void;
};

export const EmptyState = ({ onAddClick }: EmptyStateProps) => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold text-white">Your Portfolio is Empty</h2>
      <p className="mt-2 text-gray-400">
        Get started by adding your first micro-credential.
      </p>
      <div className="mt-6">
        <button
          onClick={onAddClick}
          className="inline-flex items-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors"
        >
          <FiPlus className="-ml-1 mr-2" />
          Add Your First Credential
        </button>
      </div>
    </div>
  );
};