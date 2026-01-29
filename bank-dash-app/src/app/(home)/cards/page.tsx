// Libraries
import { auth } from '@clerk/nextjs/server';

// Services
import { getCards } from '@/services/cards';

// Components
import { CardsPageContent } from '@/components/CardsPageContent';

const CardsPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-tx-primary">Please sign in to view your cards</p>
      </div>
    );
  }

  const { cards, error } = await getCards(userId);

  return <CardsPageContent cards={cards} error={error} />;
};

export default CardsPage;
