// Libraries
import { redirect } from 'next/navigation';
import { Effect } from 'effect';

// Components
import { DashboardWrapper } from '@/components/DashboardWrapper';

// Services
import { getCardsEffect } from '@/services/cards.effect';
import { getRecentTransactionsEffect } from '@/services/transactions.effect';
import { getMembersEffect } from '@/services/members.effect';
import { getMemberByClerkId } from '@/services/members';

// Utils
import { runServerEffect } from '@/lib/effect/runtime';
import { getAuth } from '@/lib/auth';
import { createMetadata } from '@/utils';

// Constants
import { ROUTES } from '@/constants/route';

export const metadata = createMetadata('Dashboard');

const HomePage = async () => {
  const { userId } = await getAuth();

  if (!userId) {
    redirect(ROUTES.SIGN_IN);
  }

  const [cardsAndTransactions, membersResult, currentMemberResult] = await Promise.all([
    runServerEffect(
      Effect.all([getCardsEffect(userId, 1, 2), getRecentTransactionsEffect(userId)], {
        concurrency: 'unbounded',
      }),
    ),
    runServerEffect(getMembersEffect(userId)),
    getMemberByClerkId(userId),
  ]);

  const [cardsResult, transactionsResult] = cardsAndTransactions;
  const { cards, error: cardsError } = cardsResult;
  const { transactions, error: transactionsError } = transactionsResult;

  const error = [cardsError, transactionsError].filter(Boolean).join('; ') || null;
  const members = [...(membersResult.members?.data ?? [])];
  const senderName = currentMemberResult.member?.name ?? 'User';

  return (
    <DashboardWrapper
      cards={cards}
      transactions={transactions}
      error={error}
      userId={userId}
      members={members}
      senderName={senderName}
    />
  );
};

export default HomePage;
