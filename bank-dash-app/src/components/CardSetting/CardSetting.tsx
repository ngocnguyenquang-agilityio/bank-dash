// Components
import { Icons } from '@/components/Icons/Icons';
import { Button } from '@/components/ui/button';

// Utils
import { cn } from '@/lib/utils';

interface CardSettingProps {
  isActive: boolean;
  isPending: boolean;
  onToggleBlock: () => void;
}

export const CardSetting = ({ isActive, isPending, onToggleBlock }: CardSettingProps) => {
  return (
    <div className="bg-white rounded-[25px] p-8 flex flex-col gap-5">
      <Button
        variant="ghost"
        onClick={isPending ? undefined : onToggleBlock}
        disabled={isPending}
        aria-label={isActive ? 'Block this card' : 'Unblock this card'}
        className={cn(
          'flex items-center gap-4 w-full text-left transition-opacity cursor-pointer bg-transparent border-0 p-0 h-auto hover:bg-transparent justify-start',
          isPending ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80',
        )}
      >
        <div className="w-[60px] h-[60px] rounded-[15px] bg-yellow-20 flex items-center justify-center flex-shrink-0">
          {isActive ? (
            <Icons.CardOff className="fill-yellow-50" />
          ) : (
            <Icons.CardOn className="fill-yellow-50" />
          )}
        </div>
        <div>
          <div className="text-base font-medium text-black">
            {isActive ? 'Block Card' : 'Unblock Card'}
          </div>
          <div className="text-[15px] text-neutral-30">
            {isPending
              ? 'Processing...'
              : isActive
                ? 'Instantly block your card'
                : 'Reactivate your card'}
          </div>
        </div>
      </Button>

      <div className="flex items-center gap-4 opacity-50 cursor-not-allowed">
        <div className="w-[60px] h-[60px] rounded-[15px] bg-blue-10 flex items-center justify-center flex-shrink-0">
          <Icons.Lock className="fill-blue-30" />
        </div>
        <div>
          <div className="text-base font-medium text-black">Change Pin Code</div>
          <div className="text-[15px] text-neutral-30">Choose another pin code</div>
        </div>
      </div>

      <div className="flex items-center gap-4 opacity-50 cursor-not-allowed">
        <div className="w-[60px] h-[60px] rounded-[15px] bg-red-30 flex items-center justify-center flex-shrink-0">
          <Icons.Google className="fill-red-50" />
        </div>
        <div>
          <div className="text-base font-medium text-black">Add to Google Pay</div>
          <div className="text-[15px] text-neutral-30">Withdraw without any card</div>
        </div>
      </div>

      <div className="flex items-center gap-4 opacity-50 cursor-not-allowed">
        <div className="w-[60px] h-[60px] rounded-[15px] bg-green-30 flex items-center justify-center flex-shrink-0">
          <Icons.Apple className="size-8 fill-green-50" />
        </div>
        <div>
          <div className="text-base font-medium text-black">Add to Apple Pay</div>
          <div className="text-[15px] text-neutral-30">Withdraw without any card</div>
        </div>
      </div>

      <div className="flex items-center gap-4 opacity-50 cursor-not-allowed">
        <div className="w-[60px] h-[60px] rounded-[15px] bg-green-30 flex items-center justify-center flex-shrink-0">
          <Icons.Apple className="size-8 fill-green-50" />
        </div>
        <div>
          <div className="text-base font-medium text-black">Add to Apple Store</div>
          <div className="text-[15px] text-neutral-30">Withdraw without any card</div>
        </div>
      </div>
    </div>
  );
};
