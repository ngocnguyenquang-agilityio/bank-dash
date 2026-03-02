// Libraries
import { Effect } from 'effect';
import { redirect } from 'next/navigation';

// Services
import { getCardsEffect } from '@/services/cards.effect';

// Components
import { CardsPageContent } from '@/components/CardsPageContent';

// Constants
import { ROUTES } from '@/constants/route';

// Utils
import { createMetadata } from '@/utils';
import { runServerEffect } from '@/lib/effect/runtime';
import { getAuth } from '@/lib/auth';

export const metadata = createMetadata('Cards');

const CardsPage = async ({
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

  const [{ cards, error }, { cards: topCardsResponse }] = await runServerEffect(
    Effect.all([getCardsEffect(userId, currentPage), getCardsEffect(userId, 1, 3)], {
      concurrency: 'unbounded',
    }),
  );

  const topCards = [...(topCardsResponse?.data ?? [])];

  return <CardsPageContent cards={cards} topCards={topCards} error={error} />;
};

export default CardsPage;
