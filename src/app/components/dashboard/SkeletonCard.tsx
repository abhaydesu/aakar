export const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-2xl p-4 animate-pulse shadow-sm border border-transparent min-h-[12rem]">
      <div className="h-6 bg-neutral-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-neutral-200 rounded w-1/2 mb-4"></div>
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="h-6 bg-neutral-200 rounded-full w-16"></div>
        <div className="h-6 bg-neutral-200 rounded-full w-20"></div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="h-4 bg-neutral-200 rounded w-24"></div>
        <div className="h-6 bg-neutral-200 rounded-full w-28"></div>
      </div>
    </div>
  );
};
