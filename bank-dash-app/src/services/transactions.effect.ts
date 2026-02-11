// Libraries
import { Effect } from 'effect';

// Services
import { apiClient } from '@/services/api';
import { requestEffect } from '@/services/api.effect';

// Types
import type { TransactionsResponse } from '@/types/transaction';

export const getRecentTransactionsEffect = (userClerkId: string) => {
  const url = `/transactions?populate=*&filters[card][member][clerkId][$eq]=${userClerkId}&pagination[page]=1&pagination[pageSize]=3&sort=updatedAt:desc`;

  return requestEffect(apiClient.get<TransactionsResponse>(url)).pipe(
    Effect.map((transactions) => ({ transactions, error: null as string | null })),
    Effect.catchAll((error) =>
      Effect.succeed({
        transactions: null as TransactionsResponse | null,
        error: error.message || 'Failed to fetch transactions',
      }),
    ),
  );
};
