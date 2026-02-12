const Loading = () => {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {/* Top row skeleton */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 h-[235px] bg-white rounded-[25px]" />
        <div className="flex-1 h-[235px] bg-white rounded-[25px]" />
      </div>

      {/* Bottom row skeleton */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 h-[322px] bg-white rounded-[25px]" />
        <div className="flex-1 h-[322px] bg-white rounded-[25px]" />
      </div>
    </div>
  );
};

export default Loading;
