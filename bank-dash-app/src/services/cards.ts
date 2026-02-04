'use server';

// Libraries
import { Effect } from 'effect';

// Services
import { apiClient } from '@/services/api';
import { requestEffect } from '@/services/api.effect';
import { getMemberByClerkId } from '@/services/members';

// Utils
import { runServerEffect } from '@/lib/effect/runtime';

// Types
import type { CardsResponse, CardFormData } from '@/types/card';

interface FetchCardsResult {
  cards: CardsResponse | null;
  error: string | null;
}

interface AddCardResult {
  success: boolean;
  error: string | null;
}

export const getCards = async (
  userClerkId: string,
  page: number = 1,
  pageSize: number = 5
): Promise<FetchCardsResult> => {
  const url = `/cards?populate=*&filters[member][clerkId][$eq]=${userClerkId}&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;

  const effect = requestEffect(apiClient.get<CardsResponse>(url)).pipe(
    Effect.map((cards) => ({ cards, error: null })),
    Effect.catchAll((error) =>
      Effect.succeed({
        cards: null,
        error: error.message || 'Failed to fetch cards',
      })
    )
  );

  return runServerEffect(effect);
};

export const addCard = async (userId: string, cardData: CardFormData): Promise<AddCardResult> => {
  const { member, error } = await getMemberByClerkId(userId);

  if (error || !member) {
    return {
      success: false,
      error: error || 'Member not found',
    };
  }

  const payload = {
    number: cardData.cardNumber,
    name: cardData.nameOnCard,
    expiration: cardData.expiration,
    isPhysical: cardData.isPhysical,
    address: cardData.address,
    member: member.documentId,
  };

  const effect = requestEffect(
    apiClient.post('/cards', {
      body: { data: payload },
    })
  ).pipe(
    Effect.map(() => ({ success: true, error: null })),
    Effect.catchAll((error) =>
      Effect.succeed({
        success: false,
        error: error.message || 'Failed to add card',
      })
    )
  );

  return runServerEffect(effect);
};
