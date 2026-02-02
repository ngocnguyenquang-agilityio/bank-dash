// Libraries
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

// Services
import { getCards } from '@/services/cards';

// Components
import { CardsPageContent } from '@/components/CardsPageContent';

const CardsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page: string | undefined }>;
}) => {
  const { userId } = await auth();
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  if (!userId) {
    redirect('/sign-in');
  }

  const { cards, error } = await getCards(userId, currentPage);

  return <CardsPageContent cards={cards} error={error} />;
};

export default CardsPage;
