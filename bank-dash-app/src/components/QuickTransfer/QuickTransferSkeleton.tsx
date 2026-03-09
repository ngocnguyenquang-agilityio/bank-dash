export const QuickTransferSkeleton = () => (
  <div className="animate-pulse bg-white rounded-[25px] px-4 py-6 flex flex-col gap-6 flex-1">
    {/* Avatars */}
    <div className="flex items-center gap-6">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <div className="w-[70px] h-[70px] rounded-full bg-neutral-20" />
          <div className="h-3 w-14 bg-neutral-20 rounded-full" />
          <div className="h-2.5 w-10 bg-neutral-20 rounded-full" />
        </div>
      ))}
      <div className="w-[50px] h-[50px] rounded-full bg-neutral-20 ml-auto flex-shrink-0" />
    </div>
    {/* Input row */}
    <div className="space-y-3">
      <div className="h-3.5 w-24 bg-neutral-20 rounded-full" />
      <div className="flex gap-4">
        <div className="flex-1 h-[50px] bg-neutral-20 rounded-[50px]" />
        <div className="w-[120px] h-[50px] bg-neutral-20 rounded-[50px]" />
      </div>
    </div>
  </div>
);
