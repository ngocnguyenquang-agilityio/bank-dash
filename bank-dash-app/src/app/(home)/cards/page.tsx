// Libraries
import { Effect } from 'effect';

// Services
import { getCardsEffect } from '@/services/cards.effect';

// Components
import { CardsPageContent } from '@/components/CardsPageContent';

// Utils
import { createMetadata } from '@/utils';
import { runServerEffect } from '@/lib/effect/runtime';
import { requireAuth } from '@/lib/auth';

export const metadata = createMetadata(
  'Cards',
  'Manage your debit and credit cards, view limits and activity',
);

const CardsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page: string | undefined }>;
}) => {
  const userId = await requireAuth();
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  const [{ cards, error }, { cards: topCardsResponse }] = await runServerEffect(
    Effect.all([getCardsEffect(userId, currentPage), getCardsEffect(userId, 1, 3)], {
      concurrency: 'unbounded',
    }),
  );

  const topCards = [...(topCardsResponse?.data ?? [])];

  return <CardsPageContent cards={cards} topCards={topCards} error={error} />;
};

export default CardsPage;
