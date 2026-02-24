const SettingLoading = () => {
  return (
    <div className="bg-white rounded-[25px] p-6 sm:p-8 lg:p-[30px] animate-pulse">
      {/* Tabs */}
      <div className="flex gap-8 border-b border-neutral-20 pb-0">
        {['w-24', 'w-24', 'w-16'].map((w, i) => (
          <div key={i} className="pb-4 flex flex-col items-center gap-1">
            <div className={`h-4 ${w} bg-neutral-20 rounded-full`} />
            {i === 0 && <div className="h-[3px] w-full bg-neutral-20 rounded-t-[10px] mt-1" />}
          </div>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-6 sm:mt-8 lg:mt-10 flex flex-col lg:flex-row gap-8 lg:gap-14">
        {/* Avatar */}
        <div className="flex justify-center lg:justify-start shrink-0">
          <div className="relative">
            <div className="w-[130px] h-[130px] rounded-full bg-neutral-20" />
            <div className="absolute bottom-0 right-0 w-[30px] h-[30px] rounded-full bg-neutral-20" />
          </div>
        </div>

        {/* Form fields */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 lg:gap-x-[29px] gap-y-[22px]">
          {/* 10 fields: Your Name, User Name, Email, Password, Date of Birth, Present Address, Permanent Address, City, Postal Code, Country */}
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="space-y-[11px]">
              <div className="h-3.5 w-28 bg-neutral-20 rounded-full" />
              <div className="h-[50px] w-full bg-neutral-20 rounded-[15px]" />
            </div>
          ))}

          {/* Save button */}
          <div className="md:col-span-2 flex justify-end mt-2">
            <div className="w-full md:w-[190px] h-[50px] bg-neutral-20 rounded-[15px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingLoading;
