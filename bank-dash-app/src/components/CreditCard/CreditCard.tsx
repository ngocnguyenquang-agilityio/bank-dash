"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface CreditCardProps {
  balance: string;
  cardHolder: string;
  cardNumber: string;
  validThru: string;
  className?: string;
}

export const CreditCard = ({
  balance,
  cardHolder,
  cardNumber,
  validThru,
  className,
}: CreditCardProps) => {
  return (
    <Card
      className={cn(
        "relative w-full sm:w-[350px] h-[200px] sm:h-[235px] rounded-[25px] p-0 overflow-hidden border-0 flex-shrink-0 bg-white border border-neutral-20",
        className,
      )}
    >
      <div className="relative z-10 p-4 sm:p-6 h-full flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className={cn("text-xs text-neutral-30")}>Balance</div>
            <div
              className={cn(
                "text-lg sm:text-xl font-semibold mt-1 text-tx-primary",
              )}
            >
              {balance}
            </div>
          </div>

          <div className="w-[30px] h-[30px] sm:w-[35px] sm:h-[35px] rounded-md bg-gradient-to-br from-amber-200 to-amber-400" />
        </div>

        {/* Card Details & Footer */}
        <div
          className={cn(
            "mt-auto rounded-b-[25px] -mx-4 sm:-mx-6 -mb-4 sm:-mb-6 px-4 sm:px-6 py-4 sm:py-5 border-t border-neutral-20",
          )}
        >
          <div className="flex items-end justify-between mb-4">
            <div>
              <div
                className={cn(
                  "text-[10px] sm:text-xs uppercase text-neutral-30",
                )}
              >
                Card Holder
              </div>
              <div
                className={cn(
                  "text-sm sm:text-[15px] font-semibold mt-1 text-tx-primary",
                )}
              >
                {cardHolder}
              </div>
            </div>
            <div>
              <div
                className={cn(
                  "text-[10px] sm:text-xs uppercase text-neutral-30",
                )}
              >
                Valid Thru
              </div>
              <div
                className={cn(
                  "text-sm sm:text-[15px] font-semibold mt-1 text-tx-primary",
                )}
              >
                {validThru}
              </div>
            </div>
          </div>

          {/* Card Number & Logo */}
          <div className="flex items-center justify-between">
            <div
              className={cn(
                "text-base sm:text-[22px] font-semibold tracking-wider text-tx-primary",
              )}
            >
              {cardNumber}
            </div>
            <div className="flex gap-1">
              <div
                className={cn(
                  "w-6 h-6 sm:w-[30px] sm:h-[30px] rounded-full bg-neutral-30/50",
                )}
              />
              <div
                className={cn(
                  "w-6 h-6 sm:w-[30px] sm:h-[30px] rounded-full -ml-2 sm:-ml-3 bg-neutral-30/50",
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CreditCard;
