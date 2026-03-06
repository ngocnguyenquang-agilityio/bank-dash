'use client';

// Libraries
import { useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

// Components
import { CreditCard } from '@/components/CreditCard';
import { TransactionsSummaryCard } from '@/components/TransactionsSummaryCard';
import { RecentTransactions } from '@/components/RecentTransactions';
import { Pagination } from '@/components/Pagination';
import { Icons } from '@/components/Icons/Icons';

// Types
import type { CardsResponse } from '@/types/card';
import type { TransactionsResponse } from '@/types/transaction';

interface TransactionsPageContentProps {
  cards: CardsResponse | null;
  transactions: TransactionsResponse | null;
  error: string | null;
}

const SUMMARY_CARDS = [
  {
    icon: '💰',
    iconBg: '#FFF5D9',
    label: 'My Balance',
    value: '$12,750',
  },
  {
    icon: '💵',
    iconBg: '#E7EDFF',
    label: 'Income',
    value: '$5,600',
  },
  {
    icon: '🧾',
    iconBg: '#FFE0EB',
    label: 'Expense',
    value: '$3,460',
  },
  {
    icon: '🏦',
    iconBg: '#DCFAF8',
    label: 'Total Saving',
    value: '$7,920',
  },
];

export const TransactionsPageContent = ({
  cards,
  transactions,
  error,
}: TransactionsPageContentProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pagination = transactions?.meta?.pagination;
  const { page = 1, pageCount = 1 } = pagination || {};

  useEffect(() => {
    if (page < pageCount) {
      router.prefetch(`/transactions?page=${page + 1}`);
    }
    if (page > 1) {
      router.prefetch(page - 1 === 1 ? '/transactions' : `/transactions?page=${page - 1}`);
    }
  }, [page, pageCount, router]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newPage === 1) {
        params.delete('page');
      } else {
        params.set('page', newPage.toString());
      }
      const query = params.toString();
      router.push(`/transactions${query ? `?${query}` : ''}`);
    },
    [router, searchParams],
  );

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
      {/* Summary Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-[30px] mb-6">
        {SUMMARY_CARDS.map((card) => (
          <TransactionsSummaryCard
            key={card.label}
            icon={card.icon}
            iconBg={card.iconBg}
            label={card.label}
            value={card.value}
          />
        ))}
      </div>

      {/* Last Transaction + My Card Row */}
      <div className="flex flex-col xl:flex-row items-start gap-6 xl:gap-[30px]">
        {/* Last Transaction Section */}
        <section className="flex flex-col w-full xl:flex-[2]">
          <h2 className="text-lg sm:text-xl md:text-[22px] font-semibold text-tx-primary mb-4">
            Last Transaction
          </h2>
          <div className="bg-white rounded-[25px]">
            <RecentTransactions transactions={transactions} className="sm:h-auto rounded-b-none" />
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 flex xl:justify-center">
              <Pagination page={page} pageCount={pageCount} onPageChange={handlePageChange} />
            </div>
          </div>
        </section>

        {/* My Card Section */}
        <section className="space-y-4 flex flex-col w-full xl:w-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl md:text-[22px] font-semibold text-tx-primary">
              My Card
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
          <div className="flex flex-col sm:flex-row xl:flex-col gap-4 sm:gap-6">
            {cardsData.length === 0 ? (
              <div className="w-full sm:w-[350px] h-[200px] sm:h-[235px] rounded-[25px] border border-dashed border-neutral-20 flex flex-col items-center justify-center gap-3 flex-shrink-0 bg-white">
                <Icons.CreditCard className="w-10 h-10 fill-blue-50" />
                <p className="text-sm text-tx-secondary">No cards yet</p>
                <Link href="/cards" className="text-sm font-medium text-blue-50 hover:underline">
                  Add your first card
                </Link>
              </div>
            ) : (
              cardsData
                .slice(0, 1)
                .map((card, index) => (
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
      </div>
    </main>
  );
};
