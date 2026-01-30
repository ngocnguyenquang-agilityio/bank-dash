'use client';

// Utils
import { cn } from '@/lib/utils';

// Icons
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Components
import { CreditCard } from '@/components/CreditCard';
import { CardListItem } from '@/components/CardListItem';

// Types
import type { CardsResponse } from '@/types/card';

interface CardsPageContentProps {
  cards: CardsResponse | null;
  error: string | null;
}

export const CardsPageContent = ({ cards, error }: CardsPageContentProps) => {
  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50/50 p-8 text-center">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* My Cards Section */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[22px] font-semibold text-tx-primary">My Cards</h2>
          <button className="text-[17px] font-semibold text-tx-primary hover:text-primary transition-colors">
            + Add Card
          </button>
        </div>

        <div className="flex gap-[30px] overflow-x-auto pb-2">
          {cards?.data?.map((card) => (
            <CreditCard
              key={card.id}
              balance={card.balance}
              cardHolder={card.name}
              cardNumber={card.number}
              expiration={card.expiration}
              className={cn(
                card.variant === 'gradient-blue' &&
                  'bg-gradient-to-br from-[#2D60FF] to-[#539BFF] text-white [&_.text-tx-primary]:text-white [&_.text-neutral-30]:text-white/70 border-0',
                card.variant === 'gradient-purple' &&
                  'bg-gradient-to-br from-[#4C49ED] to-[#0A06F4] text-white [&_.text-tx-primary]:text-white [&_.text-neutral-30]:text-white/70 border-0',
                card.variant === 'white' &&
                  'bg-white border border-[#DFEAF2] [&_.text-tx-primary]:text-[#343C6A] [&_.text-neutral-30]:text-[#718EBF]'
              )}
            />
          ))}
        </div>
      </section>

      {/* Card List Section */}
      <section className="mt-12">
        <h2 className="text-[22px] font-semibold text-tx-primary mb-5">Card List</h2>

        <div className="space-y-[20px]">
          {cards?.data?.map((card) => (
            <CardListItem
              key={card.id}
              isPhysical={card.isPhysical}
              bank={card.bank}
              cardNumber={card.number}
              nameOnCard={card.name}
              gradientColor={card.gradientColor ?? 'blue'}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end gap-3 mt-8">
          <button className="flex items-center gap-2 text-[15px] font-medium text-primary hover:opacity-80 disabled:opacity-50">
            <ChevronLeft className="w-3 h-3" strokeWidth={2} />
            Previous
          </button>

          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-[10px] bg-primary text-white text-[15px] font-medium">
              1
            </button>
            <button className="w-10 h-10 text-primary text-[15px] font-medium hover:bg-gray-100 rounded-[10px]">
              2
            </button>
            <button className="w-10 h-10 text-primary text-[15px] font-medium hover:bg-gray-100 rounded-[10px]">
              3
            </button>
            <button className="w-10 h-10 text-primary text-[15px] font-medium hover:bg-gray-100 rounded-[10px]">
              4
            </button>
          </div>

          <button className="flex items-center gap-2 text-[15px] font-medium text-primary hover:opacity-80">
            Next
            <ChevronRight className="w-3 h-3" strokeWidth={2} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default CardsPageContent;
