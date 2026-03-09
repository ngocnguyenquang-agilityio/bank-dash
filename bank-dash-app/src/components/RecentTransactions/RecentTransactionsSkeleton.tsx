export const RecentTransactionsSkeleton = () => (
  <div className="animate-pulse bg-white rounded-[25px] xl:h-[235px] px-6 py-5 space-y-4">
    {[0, 1, 2].map((i) => (
      <div key={i} className="flex items-center gap-4">
        <div className="w-[55px] h-[55px] rounded-full bg-neutral-20 flex-shrink-0" />
        <div className="flex-1 space-y-2 min-w-0">
          <div className="h-3.5 bg-neutral-20 rounded-full w-3/4" />
          <div className="h-3 bg-neutral-20 rounded-full w-1/2" />
        </div>
        <div className="h-3.5 w-10 bg-neutral-20 rounded-full flex-shrink-0" />
      </div>
    ))}
  </div>
);
