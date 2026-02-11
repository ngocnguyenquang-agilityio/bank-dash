'use client';

// Libraries
import Link from 'next/link';

// Components
import { CreditCard } from '@/components/CreditCard/index';
import { RecentTransactions } from '@/components/RecentTransactions';
import { WeeklyActivity } from '@/components/WeeklyActivity';
import { QuickTransfer } from '@/components/QuickTransfer';
import { BalanceHistory } from '@/components/BalanceHistory';

// Types
import type { CardsResponse } from '@/types/card';
import type { TransactionsResponse } from '@/types/transaction';

interface DashboardWrapperProps {
  cards: CardsResponse | null;
  transactions: TransactionsResponse | null;
  error: string | null;
}

export const DashboardWrapper = ({ cards, transactions, error }: DashboardWrapperProps) => {
  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50/50 p-8 text-center">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  const cardsData = cards?.data || [];

  return (
    <main className="p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6 lg:gap-8 mb-6">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl md:text-[22px] font-semibold text-tx-primary">
              My Cards
            </h2>
            <Link
              href="/cards"
              className="text-sm sm:text-base md:text-[17px] font-semibold text-tx-primary hover:text-blue-50"
            >
              See All
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 overflow-x-auto pb-2 scrollbar-hide">
            {cardsData.map((card) => (
              <CreditCard
                key={card.documentId}
                balance={card.balance}
                cardHolder={card.name}
                cardNumber={card.number}
                expiration={card.expiration}
              />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl md:text-[22px] font-semibold text-tx-primary">
            Recent Transaction
          </h2>
          <RecentTransactions transactions={transactions} />
        </section>
      </div>

      <section className="mb-6 space-y-4">
        <h2 className="text-lg sm:text-xl md:text-[22px] font-semibold text-tx-primary">
          Weekly Activity
        </h2>
        <WeeklyActivity />
      </section>

      <section className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
        <div className="flex flex-col space-y-4 lg:flex-1">
          <h2 className="text-lg sm:text-xl md:text-[22px] font-semibold text-tx-primary">
            Quick Transfer
          </h2>
          <QuickTransfer
            cardDocumentId={cardsData[0]?.documentId ?? ''}
            cardBalance={cardsData[0]?.balance ?? '0'}
          />
        </div>
        <div className="flex flex-col space-y-4 lg:flex-[2]">
          <h2 className="text-lg sm:text-xl md:text-[22px] font-semibold text-tx-primary">
            Balance History
          </h2>
          <BalanceHistory />
        </div>
      </section>
    </main>
  );
};
