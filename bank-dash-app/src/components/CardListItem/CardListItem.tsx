'use client';

// Libraries
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Components
import { Icons } from '@/components/Icons/Icons';

// Utils
import { cn, maskCardNumber, type MaskOption } from '@/lib/utils';

export interface CardListItemProps {
  id: string;
  isPhysical: boolean;
  cardNumber: string;
  nameOnCard: string;
  address?: string;
  maskOption?: MaskOption;
}

export const CardListItem = ({
  id,
  isPhysical,
  cardNumber,
  nameOnCard,
  address,
  maskOption = 'last4',
}: CardListItemProps) => {
  const searchParams = useSearchParams();
  const page = searchParams.get('page');
  const detailsHref = page && page !== '1' ? `/cards/${id}?page=${page}` : `/cards/${id}`;
  return (
    <div className="w-full bg-white rounded-[20px] border border-neutral-10 p-4 sm:h-[90px] sm:flex sm:items-center sm:px-6 sm:py-0 sm:gap-6">
      {/* Mobile layout */}
      <div className="flex items-center gap-4 sm:contents">
        {/* Icon */}
        <div
          className={cn(
            'flex items-center justify-center w-[60px] h-[60px] sm:w-[91px] rounded-[20px] shrink-0',
            isPhysical ? 'bg-blue-10' : 'bg-red-30',
          )}
        >
          <Icons.CreditCard
            className={cn('w-8 h-8', isPhysical ? 'fill-blue-60' : 'fill-red-60')}
          />
        </div>

        {/* Mobile: Primary info beside icon */}
        <div className="flex flex-col flex-1 min-w-0 sm:hidden">
          <div className="text-base font-medium text-black truncate">{nameOnCard}</div>
          <div className="text-[13px] text-tx-secondary mt-0.5">
            {isPhysical ? 'Physical' : 'Virtual'} | {maskCardNumber(cardNumber, maskOption)}
          </div>
        </div>

        {/* Mobile: View Details arrow */}
        <Link
          href={detailsHref}
          className="sm:hidden text-[15px] font-medium text-blue-50 shrink-0"
          aria-label="View Details"
        >
          <Icons.ChevronForwardIcon className="w-5 h-5 fill-blue-50" />
        </Link>

        {/* Desktop columns */}
        <div className="hidden sm:flex sm:flex-col sm:flex-1 sm:min-w-0">
          <div className="text-base font-medium text-black">Card Type</div>
          <div className="text-[15px] text-tx-secondary mt-1">
            {isPhysical ? 'Physical' : 'Virtual'}
          </div>
        </div>

        <div className="hidden sm:flex sm:flex-col sm:flex-1 sm:min-w-0">
          <div className="text-base font-medium text-black">Card Address</div>
          <div className="text-[15px] text-tx-secondary mt-1">{address || '--'}</div>
        </div>

        <div className="hidden sm:flex sm:flex-col sm:flex-1 sm:min-w-0">
          <div className="text-base font-medium text-black">Card Number</div>
          <div className="text-[15px] text-tx-secondary mt-1">
            {maskCardNumber(cardNumber, maskOption)}
          </div>
        </div>

        <div className="hidden sm:flex sm:flex-col sm:flex-1 sm:min-w-0">
          <div className="text-base font-medium text-black">Name on Card</div>
          <div className="text-[15px] text-tx-secondary mt-1">{nameOnCard}</div>
        </div>

        <div className="hidden sm:block shrink-0">
          <Link href={detailsHref} className="text-[15px] font-medium text-blue-50 hover:underline">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CardListItem;
