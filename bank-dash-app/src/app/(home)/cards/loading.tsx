const CardsPageLoading = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* My Cards section */}
      <section>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="h-7 w-28 bg-white rounded-full" />
          <div className="h-7 w-24 bg-white rounded-full" />
        </div>

        {/* Card skeletons */}
        <div className="flex gap-[30px] overflow-x-auto pb-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-[350px] h-[235px] bg-white rounded-[25px] flex-shrink-0" />
          ))}
        </div>
      </section>

      {/* Card List section */}
      <section className="mt-12">
        {/* Header */}
        <div className="h-7 w-24 bg-white rounded-full mb-5" />

        {/* List item skeletons */}
        <div className="space-y-[20px]">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-full h-[90px] bg-white rounded-[20px] flex items-center px-6 gap-6"
            >
              {/* Icon block */}
              <div className="w-[80px] h-[50px] bg-neutral-20 rounded-xl shrink-0" />

              {/* Text columns */}
              {[0, 1, 2, 3].map((j) => (
                <div key={j} className="flex flex-col gap-2 flex-1 min-w-0">
                  <div className="h-3.5 bg-neutral-20 rounded-full w-3/5" />
                  <div className="h-3 bg-neutral-20 rounded-full w-2/5" />
                </div>
              ))}

              {/* View Details placeholder */}
              <div className="h-3.5 w-20 bg-neutral-20 rounded-full shrink-0" />
            </div>
          ))}
        </div>

        {/* Pagination placeholder */}
        <div className="mt-6 flex justify-center gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-9 w-9 bg-white rounded-lg" />
          ))}
        </div>
      </section>
    </div>
  );
};

export default CardsPageLoading;
