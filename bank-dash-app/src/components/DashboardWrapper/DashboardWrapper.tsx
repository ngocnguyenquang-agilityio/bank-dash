'use client';

// Libraries
import Link from 'next/link';

// Components
import { CreditCard } from '@/components/CreditCard/index';
import { RecentTransactions } from '@/components/RecentTransactions';
import { WeeklyActivity } from '@/components/WeeklyActivity';
import { QuickTransfer } from '@/components/QuickTransfer';
import { BalanceHistory } from '@/components/BalanceHistory';
import { Icons } from '@/components/Icons/Icons';

// Types
import type { CardsResponse } from '@/types/card';
import type { TransactionsResponse } from '@/types/transaction';
import type { Member } from '@/types/member';

interface DashboardWrapperProps {
  cards: CardsResponse | null;
  transactions: TransactionsResponse | null;
  error: string | null;
  userId: string;
  members: Member[];
  senderName: string;
}

export const DashboardWrapper = ({
  cards,
  transactions,
  error,
  userId,
  members,
  senderName,
}: DashboardWrapperProps) => {
  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50/50 p-8 text-center">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  const cardsData = cards?.data || [];

  return (
    <main>
      <div className="flex flex-col xl:flex-row items-start gap-6 xl:gap-[30px] mb-6">
        <section className="space-y-4 flex flex-col w-full xl:w-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl md:text-[22px] font-semibold text-tx-primary">
              My Cards
            </h2>

            {cardsData.length !== 0 ? (
              <Link
                href="/cards"
                className="text-sm sm:text-base md:text-[17px] font-semibold text-tx-primary hover:text-blue-50"
              >
                See All
              </Link>
            ) : null}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 overflow-x-auto scrollbar-hide flex-1 items-start">
            {cardsData.length === 0 ? (
              <div className="w-full sm:w-[350px] h-[200px] sm:h-[235px] rounded-[25px] border border-dashed border-neutral-20 flex flex-col items-center justify-center gap-3 flex-shrink-0 bg-white">
                <Icons.CreditCard className="w-10 h-10 fill-blue-50" />
                <p className="text-sm text-tx-secondary">No cards yet</p>
                <Link href="/cards" className="text-sm font-medium text-blue-50 hover:underline">
                  Add your first card
                </Link>
              </div>
            ) : (
              cardsData.map((card, index) => (
                <CreditCard
                  key={card.documentId}
                  balance={card.balance}
                  cardHolder={card.name}
                  cardNumber={card.number}
                  expiration={card.expiration}
                  variant={index % 2 === 0 ? 'blue' : 'white'}
                />
              ))
            )}
          </div>
        </section>

        <section className="space-y-4 flex flex-col w-full xl:flex-1">
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

      <section className="flex flex-col lg:flex-row items-stretch gap-6 lg:gap-[30px]">
        <div className="flex flex-col space-y-4 lg:flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl md:text-[22px] font-semibold text-tx-primary">
            Quick Transfer
          </h2>
          <QuickTransfer userClerkId={userId} senderName={senderName} members={members} />
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
