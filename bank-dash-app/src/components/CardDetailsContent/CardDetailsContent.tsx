'use client';

// Libraries
import { useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { toast } from 'sonner';

// Components
import Link from 'next/link';
import { CreditCard } from '@/components/CreditCard';
import { CardSetting } from '@/components/CardSetting';
import { Icons } from '@/components/Icons/Icons';

// Services
import { updateCardDetails } from '@/services/cards';

// Utils
import { maskCardNumber } from '@/lib/utils';

// Types
import type { Card } from '@/types/card';

interface CardDetailsContentProps {
  card: Card;
}

export const CardDetailsContent = ({ card }: CardDetailsContentProps) => {
  const [isActive, setIsActive] = useState(card.isActive);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();

  const { balance, name, number: cardNumber, expiration, isPhysical, documentId, address } = card;

  const page = searchParams.get('page');
  const backHref = page && page !== '1' ? `/cards?page=${page}` : '/cards';

  const cardData = {
    balance,
    cardHolder: name,
    cardNumber,
    expiration,
    cardType: isPhysical ? 'Physical' : 'Virtual',
    nameOnCard: name,
    shippingAddress: address || '--',
    expirationDate: format(new Date(expiration), 'MM/yy'),
  };

  const handleToggleBlock = () => {
    startTransition(async () => {
      const newIsActive = !isActive;
      const { success, error } = await updateCardDetails(documentId, { isActive: newIsActive });

      if (success) {
        setIsActive(newIsActive);
      } else {
        toast.error(error || 'Failed to update card status');
      }
    });
  };

  const renderCardDetails = () => {
    const cardDetails = [
      { label: 'Card Type', value: cardData.cardType },
      { label: 'Name On Card', value: cardData.nameOnCard },
      { label: 'Card Number', value: maskCardNumber(cardData.cardNumber) },
      { label: 'Expiration Date', value: cardData.expirationDate },
      { label: 'Shipping Address', value: cardData.shippingAddress, fullWidth: true },
    ];

    return (
      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
        {cardDetails.map(({ label, value, fullWidth }) => (
          <div key={label} className={`space-y-3 ${fullWidth ? 'col-span-2' : ''}`}>
            <div className="text-base text-black font-normal">{label}</div>
            <div className="text-[15px] text-neutral-30">{value}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-5">
          <Link
            href={backHref}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white border border-neutral-10 hover:bg-neutral-10 transition-colors"
            aria-label="Back to cards"
          >
            <Icons.ChevronBackward className="w-5 h-5 fill-tx-primary" />
          </Link>
          <h2 className="text-[22px] font-semibold text-tx-primary">{cardData.cardHolder}</h2>
        </div>

        <div className="relative flex flex-col lg:flex-row gap-6 bg-white rounded-xl p-6">
          <div className="relative flex-shrink-0 self-start">
            <CreditCard
              balance={cardData.balance}
              cardHolder={cardData.cardHolder}
              cardNumber={maskCardNumber(cardData.cardNumber)}
              expiration={cardData.expiration}
              maskOption="firstAndLast4"
              variant="blue"
            />
            {!isActive && (
              <div className="absolute inset-0 bg-white/60 z-10 rounded-[25px] flex items-center justify-center">
                <Icons.Lock className="w-8 h-8 fill-red-500" />
              </div>
            )}
          </div>

          <div className="flex-1 bg-white rounded-[25px] p-7">{renderCardDetails()}</div>
        </div>
      </div>

      <div className="w-full lg:w-[350px] flex-shrink-0">
        <h2 className="text-[22px] font-semibold text-tx-primary mb-5">Card Setting</h2>
        <CardSetting isActive={isActive} isPending={isPending} onToggleBlock={handleToggleBlock} />
      </div>
    </div>
  );
};
