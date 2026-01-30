// Libraries
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

// Services
import { getCards } from '@/services/cards';

// Components
import { CardsPageContent } from '@/components/CardsPageContent';

const CardsPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const { cards, error } = await getCards(userId);

  return <CardsPageContent cards={cards} error={error} />;
};

export default CardsPage;
