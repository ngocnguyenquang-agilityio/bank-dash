// Libraries
import Link from 'next/link';

// Components
import { CreditCard } from '@/components/CreditCard';
import { Icons } from '@/components/Icons/Icons';

// Services
import { getCardsEffect } from '@/services/cards.effect';

// Utils
import { runServerEffect } from '@/lib/effect/runtime';
import { requireAuth } from '@/lib/auth';

export const MyCardsSection = async () => {
  const userId = await requireAuth();

  const { cards, error } = await runServerEffect(getCardsEffect(userId, 1, 2));

  if (error) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50/50 p-8 text-center">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  const cardsData = cards?.data || [];

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 overflow-x-auto scrollbar-hide flex-1 items-start">
        {cardsData.length === 0 ? (
          <div className="w-full sm:w-[350px] h-[200px] sm:h-[235px] rounded-[25px] border border-dashed border-neutral-20 flex flex-col items-center justify-center gap-3 flex-shrink-0 bg-white">
            <Icons.CreditCard className="w-10 h-10 fill-blue-50" />
            <p className="text-sm text-tx-secondary">No cards yet</p>
            <Link href="/cards" className="text-sm font-medium text-blue-50 hover:underline">
              Add your first card
            </Link>
          </div>
        ) : (
          cardsData.map((card, index) => (
            <CreditCard
              key={card.documentId}
              balance={card.balance}
              cardHolder={card.name}
              cardNumber={card.number}
              expiration={card.expiration}
              variant={index % 2 === 0 ? 'blue' : 'white'}
            />
          ))
        )}
      </div>
    </>
  );
};
