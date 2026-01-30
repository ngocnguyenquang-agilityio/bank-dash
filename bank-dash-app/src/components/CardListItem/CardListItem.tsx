'use client';

// Icons
import { CardIcon } from '@/components/Icons';

// Utils
import { cn, maskCardNumber, type MaskOption } from '@/lib/utils';

export interface CardListItemProps {
  isPhysical: boolean;
  bank: string;
  cardNumber: string;
  nameOnCard: string;
  gradientColor?: 'blue' | 'pink' | 'yellow';
  maskOption?: MaskOption;
}

const gradientClasses = {
  blue: 'bg-[#E7EDFF]',
  pink: 'bg-[#FFE0EB]',
  yellow: 'bg-[#FFF5D9]',
};

const iconColorClasses = {
  blue: 'text-[#396AFF]',
  pink: 'text-red-50',
  yellow: 'text-yellow-50',
};

export const CardListItem = ({
  isPhysical,
  bank,
  cardNumber,
  nameOnCard,
  gradientColor = 'blue',
  maskOption = 'last4',
}: CardListItemProps) => {
  return (
    <div className="w-full h-[90px] bg-white rounded-[20px] border border-neutral-10 flex items-center px-6 gap-6">
      {/* Icon */}
      <div
        className={cn(
          'w-[91px] h-[60px] rounded-[20px] flex items-center justify-center flex-shrink-0',
          gradientClasses[gradientColor]
        )}
      >
        <CardIcon className={cn('w-10 h-7', iconColorClasses[gradientColor])} />
      </div>

      {/* Card Type */}
      <div className="flex flex-col min-w-[120px]">
        <div className="text-base font-medium text-black">Card Type</div>
        <div className="text-[15px] text-[#718EBF] mt-1">{isPhysical ? 'Physical' : 'Virtual'}</div>
      </div>

      {/* Bank */}
      <div className="flex flex-col min-w-[105px]">
        <div className="text-base font-medium text-black">Bank</div>
        <div className="text-[15px] text-[#718EBF] mt-1">{bank}</div>
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
        <button className="text-[15px] font-medium text-primary hover:underline">
          View Details
        </button>
      </div>
    </div>
  );
};

export default CardListItem;
