'use client';

// Libraries
import { useCallback, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Components
import { CreditCard } from '@/components/CreditCard';
import { CardListItem } from '@/components/CardListItem';
import { Pagination } from '@/components/Pagination';
import { AddCardModal } from '@/components/AddCardModal';
import { Button } from '@/components/ui/button';

// Types
import type { CardsResponse } from '@/types/card';

interface CardsPageContentProps {
  cards: CardsResponse | null;
  error: string | null;
}

export const CardsPageContent = ({ cards, error }: CardsPageContentProps) => {
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

  return (
    <div className="space-y-6">
      {/* My Cards Section */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[22px] font-semibold text-tx-primary">My Cards</h2>
          <Button
            onClick={() => setIsAddCardModalOpen(true)}
            variant="ghost"
            className="text-[17px] font-semibold text-tx-primary hover:text-primary"
          >
            + Add Card
          </Button>
        </div>

        <div className="flex gap-[30px] overflow-x-auto pb-2">
          {cards?.data?.slice(0, 3).map((card, index) => {
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
        </div>
      </section>

      {/* Card List Section */}
      <section className="mt-12">
        <h2 className="text-[22px] font-semibold text-tx-primary mb-5">Card List</h2>

        <div className="space-y-[20px]">
          {paginatedCards.map((card) => {
            const { id, isPhysical, number, name, documentId } = card;

            return (
              <CardListItem
                key={`card-list-${id}`}
                id={documentId}
                isPhysical={isPhysical}
                cardNumber={number}
                nameOnCard={name}
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
