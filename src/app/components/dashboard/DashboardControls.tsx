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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-6">
        <div>
          <h1 className="text-4xl md:text-4xl font-extrabold text-neutral-900">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-700">
              My Skill Portfolio
            </span>
          </h1>
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