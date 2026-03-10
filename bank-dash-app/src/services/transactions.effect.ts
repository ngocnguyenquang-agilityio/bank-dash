// Libraries
import { Effect } from 'effect';

// Services
import { apiClient } from '@/services/api';
import { requestEffect } from '@/services/api.effect';

// Types
import type { TransactionsResponse } from '@/types/transaction';

// Constants
import { CACHE_TAGS, REVALIDATE } from '@/constants/cache';

export const getRecentTransactionsEffect = (userClerkId: string) => {
  const url = `/transactions?populate=*&filters[card][member][clerkId][$eq]=${userClerkId}&pagination[page]=1&pagination[pageSize]=3&sort=updatedAt:desc`;

  return requestEffect(
    apiClient.get<TransactionsResponse>(url, {
      next: {
        revalidate: REVALIDATE.TRANSACTIONS,
        tags: [CACHE_TAGS.TRANSACTIONS, CACHE_TAGS.TRANSACTIONS_USER(userClerkId)],
      },
    }),
  ).pipe(
    Effect.map((transactions) => ({ transactions, error: null as string | null })),
    Effect.catchAll((error) =>
      Effect.succeed({
        transactions: null as TransactionsResponse | null,
        error: error.message || 'Failed to fetch transactions',
      }),
    ),
    Effect.withSpan('getRecentTransactionsEffect', { attributes: { userClerkId } }),
  );
};

export const getTransactionsEffect = (
  userClerkId: string,
  page: number = 1,
  pageSize: number = 5,
) => {
  const url = `/transactions?filters[card][member][clerkId][$eq]=${userClerkId}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=updatedAt:desc`;

  return requestEffect(
    apiClient.get<TransactionsResponse>(url, {
      next: {
        revalidate: REVALIDATE.TRANSACTIONS,
        tags: [CACHE_TAGS.TRANSACTIONS, CACHE_TAGS.TRANSACTIONS_USER(userClerkId)],
      },
    }),
  ).pipe(
    Effect.map((transactions) => ({ transactions, error: null as string | null })),
    Effect.catchAll((error) =>
      Effect.succeed({
        transactions: null as TransactionsResponse | null,
        error: error.message || 'Failed to fetch transactions',
      }),
    ),
    Effect.withSpan('getTransactionsEffect', { attributes: { userClerkId, page, pageSize } }),
  );
};
