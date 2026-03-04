// Libraries
import { Effect } from 'effect';

// Services
import { apiClient } from '@/services/api';
import { requestEffect } from '@/services/api.effect';

// Types
import type { CardsResponse } from '@/types/card';

// Constants
import { CACHE_TAGS, REVALIDATE } from '@/constants/cache';

export const getCardsEffect = (userClerkId: string, page: number = 1, pageSize: number = 5) => {
  const url = `/cards?populate=*&sort=updatedAt:desc&filters[member][clerkId][$eq]=${userClerkId}&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;

  return requestEffect(
    apiClient.get<CardsResponse>(url, {
      next: {
        revalidate: REVALIDATE.CARDS,
        tags: [CACHE_TAGS.CARDS, CACHE_TAGS.CARDS_USER(userClerkId)],
      },
    }),
  ).pipe(
    Effect.map((cards) => ({ cards, error: null as string | null })),
    Effect.catchAll((error) =>
      Effect.succeed({
        cards: null as CardsResponse | null,
        error: error.message || 'Failed to fetch cards',
      }),
    ),
  );
};
