import React from 'react';

// Components
import { Card } from '@/components/ui/card';

interface TransactionsSummaryCardProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
}

export const TransactionsSummaryCard = ({
  icon,
  iconBg,
  label,
  value,
}: TransactionsSummaryCardProps) => (
  <Card className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-[20px] sm:rounded-[25px] border-0 flex-1 min-w-[140px]">
    <div
      className="w-12 h-12 sm:w-[55px] sm:h-[55px] md:w-[70px] md:h-[70px] rounded-full flex items-center justify-center text-xl sm:text-2xl flex-shrink-0"
      style={{ backgroundColor: iconBg }}
    >
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-xs sm:text-sm md:text-[15px] text-tx-secondary">{label}</span>
      <span className="text-base sm:text-lg md:text-xl lg:text-[22px] font-semibold text-tx-primary">
        {value}
      </span>
    </div>
  </Card>
);
