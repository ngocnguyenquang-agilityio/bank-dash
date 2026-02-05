// Services
import { getCardDetails } from '@/services/cards';

// Components
import { CardDetailsContent } from '@/components/CardDetailsContent/CardDetailsContent';

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
