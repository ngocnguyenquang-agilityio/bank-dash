// Libraries
import { redirect } from 'next/navigation';

// Components
import { RecentTransactions } from '@/components/RecentTransactions';

// Services
import { getRecentTransactionsEffect } from '@/services/transactions.effect';

// Utils
import { runServerEffect } from '@/lib/effect/runtime';
import { getAuth } from '@/lib/auth';

// Constants
import { ROUTES } from '@/constants/route';

export const RecentTransactionsSection = async () => {
  const { userId } = await getAuth();

  if (!userId) {
    redirect(ROUTES.SIGN_IN);
  }

  const { transactions, error } = await runServerEffect(getRecentTransactionsEffect(userId));

  if (error) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50/50 p-8 text-center">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  return <RecentTransactions transactions={transactions} />;
};
