'use client';

// Libraries
import Link from 'next/link';

// Components
import { Icons } from '@/components/Icons/Icons';

// Utils
import { cn, maskCardNumber, type MaskOption } from '@/lib/utils';

export interface CardListItemProps {
  id: string;
  isPhysical: boolean;
  cardNumber: string;
  nameOnCard: string;
  maskOption?: MaskOption;
}

export const CardListItem = ({
  id,
  isPhysical,
  cardNumber,
  nameOnCard,
  maskOption = 'last4',
}: CardListItemProps) => {
  return (
    <div className="w-full h-[90px] bg-white rounded-[20px] border border-neutral-10 flex items-center px-6 gap-6">
      {/* Icon */}
      <div
        className={cn(
          'flex items-center justify-center w-[80px] h-[50px] rounded-xl pt-1',
          isPhysical ? 'bg-blue-10' : 'bg-red-30',
        )}
      >
        <Icons.CreditCard className={cn('w-8 h-8', isPhysical ? 'fill-blue-60' : 'fill-red-60')} />
      </div>

      {/* Card Type */}
      <div className="flex flex-col min-w-[120px]">
        <div className="text-base font-medium text-black">Card Type</div>
        <div className="text-[15px] text-[#718EBF] mt-1">{isPhysical ? 'Physical' : 'Virtual'}</div>
      </div>

      {/* Card Number */}
      <div className="flex flex-col min-w-[162px]">
        <div className="text-base font-medium text-black">Card Number</div>
        <div className="text-[15px] text-[#718EBF] mt-1">
          {maskCardNumber(cardNumber, maskOption)}
        </div>
      </div>

      {/* Name on Card */}
      <div className="flex flex-col min-w-[150px]">
        <div className="text-base font-medium text-black">Name on Card</div>
        <div className="text-[15px] text-[#718EBF] mt-1">{nameOnCard}</div>
      </div>

      {/* View Details */}
      <div className="ml-auto">
        <Link
          href={`/cards/${id}`}
          className="text-[15px] font-medium text-blue-50 hover:underline"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default CardListItem;
