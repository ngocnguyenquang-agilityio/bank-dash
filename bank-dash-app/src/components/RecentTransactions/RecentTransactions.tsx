'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Transactions, TransactionType } from '@/types/card';

interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  type: TransactionType;
  icon: string;
  iconBg: string;
}

const transactions: Transaction[] = [
  {
    id: '1',
    title: 'Deposit from my Card',
    date: '28 January 2021',
    amount: 850,
    type: Transactions.Withdrawal,
    icon: '💳',
    iconBg: 'var(--color-yellow-30)',
  },
  {
    id: '2',
    title: 'Deposit Paypal',
    date: '25 January 2021',
    amount: 2500,
    type: Transactions.Deposit,
    icon: '💰',
    iconBg: 'var(--color-blue-10)',
  },
  {
    id: '3',
    title: 'Jemi Wilson',
    date: '21 January 2021',
    amount: 5400,
    type: Transactions.Deposit,
    icon: '👤',
    iconBg: 'var(--color-green-40)',
  },
];

export function RecentTransactions() {
  return (
    <Card className="w-full h-auto xl:h-[235px] rounded-[25px] border-0">
      <CardContent className="space-y-3 sm:space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center gap-3 sm:gap-4">
            {/* Icon */}
            <div
              className="w-10 h-10 sm:w-[55px] sm:h-[55px] rounded-full flex items-center justify-center text-xl sm:text-2xl flex-shrink-0"
              style={{ backgroundColor: transaction.iconBg }}
            >
              {transaction.icon}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm sm:text-[16px] text-black truncate">
                {transaction.title}
              </div>
              <div className="text-xs sm:text-[15px] text-neutral-30">{transaction.date}</div>
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
        ))}
      </CardContent>
    </Card>
  );
}
