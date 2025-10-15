export const SkeletonCard = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 animate-pulse">
      <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="h-5 bg-gray-700 rounded-full w-16"></div>
        <div className="h-5 bg-gray-700 rounded-full w-20"></div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="h-4 bg-gray-700 rounded w-24"></div>
        <div className="h-6 bg-gray-700 rounded-full w-28"></div>
      </div>
    </div>
  );
};