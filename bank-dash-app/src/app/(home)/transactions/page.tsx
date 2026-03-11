// Libraries
import { Effect } from 'effect';
import { redirect } from 'next/navigation';

// Components
import { TransactionsPageContent } from '@/components/TransactionsPageContent';

// Services
import { getCardsEffect } from '@/services/cards.effect';
import { getTransactionsEffect } from '@/services/transactions.effect';

// Utils
import { runServerEffect } from '@/lib/effect/runtime';
import { getAuth } from '@/lib/auth';
import { createMetadata } from '@/utils';

// Constants
import { ROUTES } from '@/constants/route';

export const metadata = createMetadata(
  'Transactions',
  'View and filter your complete transaction history',
);

const TransactionsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page: string | undefined }>;
}) => {
  const { userId } = await getAuth();
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  if (!userId) {
    redirect(ROUTES.SIGN_IN);
  }

  const [cardsResult, transactionsResult] = await runServerEffect(
    Effect.all([getCardsEffect(userId, 1, 1), getTransactionsEffect(userId, currentPage, 5)], {
      concurrency: 'unbounded',
    }),
  );

  const { cards, error: cardsError } = cardsResult;
  const { transactions, error: transactionsError } = transactionsResult;

  const error = [cardsError, transactionsError].filter(Boolean).join('; ') || null;

  return <TransactionsPageContent cards={cards} transactions={transactions} error={error} />;
};

export default TransactionsPage;
