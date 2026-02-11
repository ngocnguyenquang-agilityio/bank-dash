// Libraries
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Effect } from 'effect';

// Components
import { DashboardWrapper } from '@/components/DashboardWrapper';

// Services
import { getCardsEffect } from '@/services/cards.effect';
import { getRecentTransactionsEffect } from '@/services/transactions.effect';

// Utils
import { runServerEffect } from '@/lib/effect/runtime';

// Constants
import { ROUTES } from '@/constants/route';

const HomePage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect(ROUTES.SIGN_IN);
  }

  const [cardsResult, transactionsResult] = await runServerEffect(
    Effect.all([getCardsEffect(userId, 1, 3), getRecentTransactionsEffect(userId)]),
  );

  const { cards, error: cardsError } = cardsResult;
  const { transactions, error: transactionsError } = transactionsResult;

  const error = [cardsError, transactionsError].filter(Boolean).join('; ') || null;

  return <DashboardWrapper cards={cards} transactions={transactions} error={error} />;
};

export default HomePage;
