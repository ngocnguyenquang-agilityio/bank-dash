'use client';

// Libraries
import { useState, useTransition } from 'react';
import { format } from 'date-fns';

// Components
import { CreditCard } from '@/components/CreditCard';
import { CardSetting } from '@/components/CardSetting';

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

  const { balance, name, number: cardNumber, expiration, isPhysical, documentId, address } = card;

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
        console.error('Failed to update card:', error);
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
        <h2 className="text-[22px] font-semibold text-tx-primary mb-5">{cardData.cardHolder}</h2>

        <div className="flex flex-col lg:flex-row gap-6 bg-white rounded-xl p-6">
          <div className="flex-shrink-0">
            <CreditCard
              balance={cardData.balance}
              cardHolder={cardData.cardHolder}
              cardNumber={maskCardNumber(cardData.cardNumber)}
              expiration={cardData.expiration}
              className="bg-gradient-to-br from-blue-30 to-blue-20"
              maskOption="firstAndLast4"
            />
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
