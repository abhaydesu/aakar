import { FiPlus, FiSearch } from 'react-icons/fi';

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
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold">My Skill Portfolio</h1>
          <p className="text-gray-400 mt-1">A unified view of all your micro-credentials.</p>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <button
            onClick={onAddClick}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors"
          >
            <FiPlus className="mr-2" /> Add
          </button>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by skill, title, issuer..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={onGroupToggle}
          className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
        >
          {isGrouped ? 'Show All' : 'Group Duplicates'}
        </button>
      </div>
    </>
  );
};