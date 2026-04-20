export function ServicioCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 animate-pulse">
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
        </div>
        <div className="flex gap-1">
          <div className="h-8 w-8 bg-gray-100 rounded" />
          <div className="h-8 w-8 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-32 bg-gray-200 rounded-md w-full" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-4/5" />
        <div className="flex items-center justify-between mt-4">
          <div className="h-8 bg-gray-200 rounded w-24" />
          <div className="h-6 bg-gray-100 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

export function ServicioCardSkeletonGrid({ count = 6 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ServicioCardSkeleton key={i} />
      ))}
    </div>
  );
}