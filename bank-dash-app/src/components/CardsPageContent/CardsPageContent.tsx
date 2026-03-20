'use client';

// Libraries
import { useCallback, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Components
import { CreditCard } from '@/components/CreditCard';
import { CardListItem } from '@/components/CardListItem';
import { Pagination } from '@/components/Pagination';
import { AddCardModal } from '@/components/AddCardModal';
import { Button } from '@/components/ui/Button';
import { Icons } from '@/components/Icons/Icons';

// Types
import type { Card, CardsResponse } from '@/types/card';

interface CardsPageContentProps {
  cards: CardsResponse | null;
  topCards: Card[];
  error: string | null;
}

export const CardsPageContent = ({ cards, topCards, error }: CardsPageContentProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (page === 1) {
        params.delete('page');
      } else {
        params.set('page', page.toString());
      }
      router.push(`/cards?${params.toString()}`);
    },
    [router, searchParams],
  );

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50/50 p-8 text-center">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  const pagination = cards?.meta?.pagination;
  const { page = 1, pageCount = 1 } = pagination || {};
  const paginatedCards = cards?.data || [];
  const hasCards = topCards.length > 0;

  // Empty state when user has no cards
  if (!hasCards) {
    return (
      <>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
          <div className="w-20 h-20 rounded-full bg-blue-10 flex items-center justify-center">
            <Icons.CreditCard className="w-10 h-10 fill-blue-50" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-semibold text-tx-primary">No cards yet</h2>
            <p className="text-base sm:text-lg text-neutral-30 max-w-md">
              Add your first card to start managing your finances
            </p>
          </div>
          <Button
            onClick={() => setIsAddCardModalOpen(true)}
            className="h-[50px] px-8 rounded-[15px] bg-blue-50 text-white text-base font-medium hover:bg-blue-60 transition-colors"
          >
            + Add Card
          </Button>
        </div>

        {/* Add Card Modal */}
        <AddCardModal open={isAddCardModalOpen} onOpenChange={setIsAddCardModalOpen} />
      </>
    );
  }

  return (
    <div className="space-y-6">
      {/* My Cards Section */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[22px] font-semibold text-tx-primary">My Cards</h2>
          <Button
            onClick={() => setIsAddCardModalOpen(true)}
            variant="ghost"
            className="lg:hidden text-[17px] font-semibold text-tx-primary hover:text-primary"
          >
            + Add Card
          </Button>
        </div>

        <div className="flex gap-[30px] overflow-x-auto pb-2 lg:scrollbar-hide">
          {topCards.map((card, index) => {
            const { id, balance, name, number, expiration } = card;
            const variant = index % 2 === 0 ? 'blue' : 'white';

            return (
              <CreditCard
                key={`my-card-${id}`}
                balance={balance}
                cardHolder={name}
                cardNumber={number}
                expiration={expiration}
                variant={variant}
              />
            );
          })}

          {/* Add Card Button — visible only on large screens inside the scroll row */}
          <Button
            onClick={() => setIsAddCardModalOpen(true)}
            variant="ghost"
            className="group hidden lg:flex w-[350px] h-[235px] rounded-[25px] flex-shrink-0 border-2 border-dashed border-neutral-20 flex-col items-center justify-center gap-3 bg-white hover:border-blue-50 hover:bg-blue-10/50"
          >
            <div className="w-12 h-12 rounded-full bg-blue-10 group-hover:bg-blue-50/20 flex items-center justify-center transition-colors">
              <span className="text-2xl text-blue-50 font-light leading-none">+</span>
            </div>
            <span className="text-[15px] font-semibold text-tx-primary">Add Card</span>
          </Button>
        </div>
      </section>

      {/* Card List Section */}
      <section className="mt-12">
        <h2 className="text-[22px] font-semibold text-tx-primary mb-5">Card List</h2>

        <div className="space-y-[20px]">
          {paginatedCards.map((card) => {
            const { id, isPhysical, number, name, documentId, address } = card;

            return (
              <CardListItem
                key={`card-list-${id}`}
                id={documentId}
                isPhysical={isPhysical}
                cardNumber={number}
                nameOnCard={name}
                address={address}
              />
            );
          })}
        </div>

        <Pagination page={page} pageCount={pageCount} onPageChange={handlePageChange} />
      </section>

      {/* Add Card Modal */}
      <AddCardModal open={isAddCardModalOpen} onOpenChange={setIsAddCardModalOpen} />
    </div>
  );
};

export default CardsPageContent;
