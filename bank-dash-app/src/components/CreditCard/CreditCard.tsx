'use client';

// Libraries
import { format, parseISO } from 'date-fns';

// Components
import { Card } from '@/components/ui/card';
import { Icons } from '@/components/Icons/Icons';

// Utils
import { cn, maskCardNumber, type MaskOption } from '@/lib/utils';

export interface CreditCardProps {
  balance: string;
  cardHolder: string;
  cardNumber: string;
  expiration: string;
  className?: string;
  maskOption?: MaskOption;
  variant?: 'white' | 'blue';
}

export const CreditCard = ({
  balance,
  cardHolder,
  cardNumber,
  expiration,
  className,
  maskOption = 'firstAndLast4',
  variant = 'white',
}: CreditCardProps) => {
  const isBlue = variant === 'blue';

  return (
    <Card
      className={cn(
        'relative w-[300px] sm:w-[350px] h-[200px] sm:h-[235px] rounded-[25px] p-0 overflow-hidden flex-shrink-0 border',
        isBlue
          ? 'bg-gradient-to-br from-blue-50 to-blue-60 border-none text-white'
          : 'bg-white border-neutral-20 text-tx-primary',
        className,
      )}
    >
      <div className="relative z-10 p-4 sm:p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex flex-col">
            <div className={cn('text-xs', isBlue ? 'text-white/70' : 'text-neutral-30')}>
              Balance
            </div>
            <div
              className={cn(
                'text-lg sm:text-xl font-semibold mt-1',
                isBlue ? 'text-white' : 'text-tx-primary',
              )}
            >
              ${balance}
            </div>
          </div>

          {isBlue ? <Icons.ChipWhite /> : <Icons.Chip />}
        </div>

        <div className="flex items-center gap-[60px] mb-4 sm:mb-6">
          <div>
            <div
              className={cn(
                'text-[10px] sm:text-xs uppercase',
                isBlue ? 'text-white/70' : 'text-neutral-30',
              )}
            >
              Card Holder
            </div>
            <div
              className={cn(
                'text-sm sm:text-[15px] font-semibold mt-1',
                isBlue ? 'text-white' : 'text-tx-primary',
              )}
            >
              {cardHolder}
            </div>
          </div>
          <div>
            <div
              className={cn(
                'text-[10px] sm:text-xs uppercase',
                isBlue ? 'text-white/70' : 'text-neutral-30',
              )}
            >
              Valid Thru
            </div>
            <div
              className={cn(
                'text-sm sm:text-[15px] font-semibold mt-1',
                isBlue ? 'text-white' : 'text-tx-primary',
              )}
            >
              {format(parseISO(expiration), 'MM/yy')}
            </div>
          </div>
        </div>

        <div
          className={cn(
            'mt-auto rounded-b-[25px] -mx-4 sm:-mx-6 -mb-4 sm:-mb-6 px-4 sm:px-6 py-4 sm:py-5 border-t',
            isBlue ? 'bg-gradient-to-b from-white/15 to-white/0 border-none' : 'border-neutral-20',
          )}
        >
          <div className="flex items-center justify-between">
            <div
              className={cn(
                'text-base sm:text-[22px] font-semibold tracking-wider',
                isBlue ? 'text-white' : 'text-tx-primary',
              )}
            >
              {maskCardNumber(cardNumber, maskOption)}
            </div>

            <Icons.Master className={cn(isBlue ? 'fill-white/50' : '')} />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CreditCard;
