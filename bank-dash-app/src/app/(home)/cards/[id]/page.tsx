// Libraries
import type { Metadata } from 'next';

// Services
import { getCardDetails } from '@/services/cards';

// Components
import { CardDetailsContent } from '@/components/CardDetailsContent/CardDetailsContent';

// Utils
import { createMetadata } from '@/utils';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> => {
  const { id } = await params;
  const { card } = await getCardDetails(id);

  return createMetadata(card?.name ? `${card.name}'s Card` : 'Card Details');
};

const CardDetailsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id: documentId } = await params;
  const { card, error } = await getCardDetails(documentId);

  if (error || !card) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return <CardDetailsContent card={card} />;
};

export default CardDetailsPage;
