// Libraries
import { Suspense } from 'react';
import Link from 'next/link';

// Components
import {
  MyCardsSection,
  RecentTransactionsSection,
  QuickTransferSection,
} from '@/components/DashboardSections';
import { WeeklyActivity } from '@/components/WeeklyActivity';
import { BalanceHistory } from '@/components/BalanceHistory';

// Skeletons
import { MyCardsSkeleton } from '@/components/CreditCard/MyCardsSkeleton';
import { RecentTransactionsSkeleton } from '@/components/RecentTransactions/RecentTransactionsSkeleton';
import { QuickTransferSkeleton } from '@/components/QuickTransfer/QuickTransferSkeleton';

// Utils
import { createMetadata } from '@/utils';

export const metadata = createMetadata(
  'Dashboard',
  'Overview of your account, recent transactions, and quick transfer tools',
);

const HomePage = async () => {
  return (
    <main>
      <div className="flex flex-col xl:flex-row items-start gap-6 xl:gap-[30px] mb-6">
        <section className="space-y-4 flex flex-col w-full xl:w-auto">
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
          <Suspense fallback={<MyCardsSkeleton />}>
            <MyCardsSection />
          </Suspense>
        </section>

        <section className="space-y-4 flex flex-col w-full xl:flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl md:text-[22px] font-semibold text-tx-primary">
              Recent Transaction
            </h2>
            <Link
              href="/transactions"
              className="text-sm sm:text-base md:text-[17px] font-semibold text-tx-primary hover:text-blue-50"
            >
              See All
            </Link>
          </div>
          <Suspense fallback={<RecentTransactionsSkeleton />}>
            <RecentTransactionsSection />
          </Suspense>
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
          <Suspense fallback={<QuickTransferSkeleton />}>
            <QuickTransferSection />
          </Suspense>
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

export default HomePage;
