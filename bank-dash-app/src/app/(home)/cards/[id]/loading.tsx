const CardDetailLoading = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-pulse">
      {/* Left section */}
      <div className="flex-1">
        <div className="h-7 w-48 bg-neutral-20 rounded-md mb-5" />

        <div className="flex flex-col lg:flex-row gap-6 bg-white rounded-xl p-6">
          {/* Credit card skeleton */}
          <div className="flex-shrink-0 w-[350px] h-[235px] bg-neutral-20 rounded-[15px]" />

          {/* Card details skeleton */}
          <div className="flex-1 p-7 space-y-6">
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-4 w-24 bg-neutral-20 rounded" />
                  <div className="h-4 w-36 bg-neutral-10 rounded" />
                </div>
              ))}
              {/* Full width field */}
              <div className="col-span-2 space-y-3">
                <div className="h-4 w-32 bg-neutral-20 rounded" />
                <div className="h-4 w-64 bg-neutral-10 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right sidebar - Card Setting */}
      <div className="w-full lg:w-[350px] flex-shrink-0">
        <div className="h-7 w-32 bg-neutral-20 rounded-md mb-5" />
        <div className="bg-white rounded-[25px] p-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 bg-neutral-10 rounded-[15px]" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardDetailLoading;
