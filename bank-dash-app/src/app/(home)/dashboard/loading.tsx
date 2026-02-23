const DashboardLoading = () => {
  return (
    <div className="animate-pulse">
      {/* Row 1: My Cards + Recent Transaction */}
      <div className="flex items-start gap-[30px] mb-6">
        {/* My Cards */}
        <div className="space-y-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="h-7 w-24 bg-white rounded-full" />
            <div className="h-7 w-16 bg-white rounded-full" />
          </div>
          <div className="flex gap-8">
            <div className="w-[350px] h-[235px] bg-white rounded-[25px] flex-shrink-0" />
            <div className="w-[350px] h-[235px] bg-white rounded-[25px] flex-shrink-0" />
          </div>
        </div>

        {/* Recent Transaction */}
        <div className="space-y-4 flex flex-col lg:flex-1">
          <div className="h-7 w-44 bg-white rounded-full" />
          <div className="bg-white rounded-[25px] xl:h-[235px] px-6 py-5 space-y-4">
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
        </div>
      </div>

      {/* Row 2: Weekly Activity */}
      <div className="mb-6 space-y-4">
        <div className="h-7 w-36 bg-white rounded-full" />
        <div className="bg-white rounded-[25px] px-6 pt-6 pb-5">
          {/* Chart bars */}
          <div className="h-[226px] flex items-end justify-between gap-2 px-6 pb-2">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-end gap-1.5 flex-1">
                <div
                  className="flex-1 bg-neutral-20 rounded-[10px]"
                  style={{ height: `${55 + ((i * 37) % 55)}%` }}
                />
                <div
                  className="flex-1 bg-neutral-20/60 rounded-[10px]"
                  style={{ height: `${35 + ((i * 29) % 45)}%` }}
                />
              </div>
            ))}
          </div>
          {/* Legend */}
          <div className="flex justify-end gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-neutral-20" />
              <div className="h-3 w-12 bg-neutral-20 rounded-full" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-neutral-20" />
              <div className="h-3 w-14 bg-neutral-20 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Quick Transfer + Balance History */}
      <div className="flex items-stretch gap-[30px]">
        {/* Quick Transfer */}
        <div className="flex flex-col space-y-4 lg:flex-1">
          <div className="h-7 w-32 bg-white rounded-full" />
          <div className="bg-white rounded-[25px] px-4 py-6 flex flex-col gap-6 flex-1">
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
        </div>

        {/* Balance History */}
        <div className="flex flex-col space-y-4 lg:flex-[2]">
          <div className="h-7 w-36 bg-white rounded-full" />
          <div className="bg-white rounded-[25px] px-5 py-6 flex-1 min-h-[276px]">
            {/* Chart wave suggestion */}
            <div className="h-full flex flex-col justify-between">
              <div className="flex-1 flex items-end gap-0 pb-4">
                {[200, 380, 240, 580, 360, 680, 500].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-neutral-20 to-neutral-20/20 rounded-t-full"
                    style={{ height: `${(h / 720) * 100}%` }}
                  />
                ))}
              </div>
              {/* X-axis labels */}
              <div className="flex justify-between">
                {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'].map((m) => (
                  <div key={m} className="h-3 w-6 bg-neutral-20 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLoading;
