'use client';

// Libraries
import React from 'react';

// Components
import { Card, CardContent } from '@/components/ui/card';
import { Icons } from '@/components/Icons/Icons';

// Utils
import { cn } from '@/lib/utils';

// Types
import { Transactions, TransactionType } from '@/types/card';
import type { TransactionsResponse } from '@/types/transaction';

interface RecentTransactionsProps {
  transactions: TransactionsResponse | null;
  className?: string;
}

const ICON_MAP: Record<TransactionType, { icon: React.ReactNode; iconBg: string }> = {
  [Transactions.Deposit]: {
    icon: <Icons.MoneyTag className="fill-[#16DBCC]" />,
    iconBg: '#DCFAF8',
  },
  [Transactions.Withdrawal]: {
    icon: <Icons.MedicalRecipe className="fill-[#FF82AC]" />,
    iconBg: '#FFE0EB',
  },
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const RecentTransactions = ({ transactions, className }: RecentTransactionsProps) => {
  const transactionsData = transactions?.data || [];

  if (transactionsData.length === 0) {
    return (
      <Card className={cn('w-full h-auto sm:h-[235px] rounded-[25px] border-0', className)}>
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-tx-secondary text-sm">No recent transactions</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('w-full h-auto sm:h-[235px] rounded-[25px] border-0', className)}>
      <CardContent className="space-y-3 sm:space-y-4">
        {transactionsData.map((transaction) => {
          const iconConfig = ICON_MAP[transaction.type] ?? ICON_MAP[Transactions.Withdrawal];
          const { icon, iconBg } = iconConfig;

          return (
            <div key={transaction.documentId} className="flex items-center gap-3 sm:gap-4">
              {/* Icon */}
              <div
                className="w-10 h-10 sm:w-[55px] sm:h-[55px] rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: iconBg }}
              >
                {icon}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm sm:text-[16px] text-black truncate">
                  {transaction.message}
                </div>
                <div className="text-xs sm:text-[15px] text-neutral-30">
                  {formatDate(transaction.createdAt)}
                </div>
              </div>

              {/* Amount */}
              <div
                className={`font-medium text-sm sm:text-[16px] flex-shrink-0 ${
                  transaction.type === 'deposit' ? 'text-green-40' : 'text-red-60'
                }`}
              >
                {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toLocaleString()}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
