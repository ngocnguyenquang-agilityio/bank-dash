// Libraries
import { Effect } from 'effect';

// Services
import { apiClient } from './api';
import { requestEffect } from './api.effect';

// Utils
import { runServerEffect } from '@/lib/effect/runtime';

// Types
import type { CardsResponse } from '@/types/card';

interface FetchCardsResult {
  cards: CardsResponse | null;
  error: string | null;
}

export const getCards = async (userClerkId: string): Promise<FetchCardsResult> => {
  const url = `/cards?populate=*&filters[member][clerkId][$eq]=${userClerkId}`;

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
