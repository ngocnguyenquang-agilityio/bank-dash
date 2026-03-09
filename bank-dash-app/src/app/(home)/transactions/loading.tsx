const TransactionsLoading = () => {
  return (
    <div className="animate-pulse">
      {/* Summary Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-[30px] mb-6">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-[20px] sm:rounded-[25px] bg-white flex-1 min-w-[140px]"
          >
            <div className="w-12 h-12 sm:w-[55px] sm:h-[55px] md:w-[70px] md:h-[70px] rounded-full bg-neutral-20 flex-shrink-0" />
            <div className="flex flex-col gap-2">
              <div className="h-3 sm:h-3.5 w-16 sm:w-20 bg-neutral-20 rounded-full" />
              <div className="h-4 sm:h-5 md:h-6 w-14 sm:w-18 bg-neutral-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Last Transaction + My Card Row */}
      <div className="flex flex-col xl:flex-row items-start gap-6 xl:gap-[30px]">
        {/* Last Transaction Section */}
        <div className="flex flex-col w-full xl:flex-[2]">
          <div className="h-7 w-40 bg-white rounded-full mb-4" />
          <div className="bg-white rounded-[25px]">
            <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-[55px] h-[55px] rounded-full bg-neutral-20 flex-shrink-0" />
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="h-3.5 bg-neutral-20 rounded-full w-3/4" />
                    <div className="h-3 bg-neutral-20 rounded-full w-1/2" />
                  </div>
                  <div className="h-3.5 w-16 bg-neutral-20 rounded-full flex-shrink-0" />
                </div>
              ))}
            </div>
            {/* Pagination */}
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 flex xl:justify-center">
              <div className="flex items-center gap-2">
                <div className="h-8 w-20 bg-neutral-20 rounded-full" />
                <div className="h-8 w-8 bg-neutral-20 rounded-full" />
                <div className="h-8 w-8 bg-neutral-20 rounded-full" />
                <div className="h-8 w-8 bg-neutral-20 rounded-full" />
                <div className="h-8 w-20 bg-neutral-20 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* My Card Section */}
        <div className="space-y-4 flex flex-col w-full xl:w-auto">
          <div className="flex items-center justify-between">
            <div className="h-7 w-20 bg-white rounded-full" />
            <div className="h-7 w-16 bg-white rounded-full" />
          </div>
          <div className="flex flex-col sm:flex-row xl:flex-col gap-4 sm:gap-6">
            <div className="w-full sm:w-[350px] h-[200px] sm:h-[235px] bg-white rounded-[25px] flex-shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsLoading;
