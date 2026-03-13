'use server';

// Libraries
import { Effect } from 'effect';
import { updateTag } from 'next/cache';

// Services
import { apiClient } from '@/services/api';
import { requestEffect } from '@/services/api.effect';
import { getRecentTransactionsEffect } from '@/services/transactions.effect';

// Utils
import { runServerEffect } from '@/lib/effect/runtime';

// Constants
import { CACHE_TAGS } from '@/constants/cache';
import { TRANSACTION_ERRORS } from '@/constants/error';

// Types
import type { Transactions } from '@/types/card';

type ServiceResult<T extends Record<string, unknown> = Record<string, never>> = {
  error: string | null;
} & T;

export const getRecentTransactions = async (
  userClerkId: string,
): Promise<ServiceResult<{ transactions: unknown | null }>> => {
  return runServerEffect(getRecentTransactionsEffect(userClerkId));
};

interface CreateTransactionData {
  cardDocumentId: string;
  amount: number;
  message: string;
  type: Transactions;
}

export const createTransaction = async (
  data: CreateTransactionData,
): Promise<ServiceResult<{ success: boolean }>> => {
  const payload = {
    message: data.message,
    amount: data.amount,
    type: data.type,
    card: data.cardDocumentId,
    date: new Date().toISOString().split('T')[0],
  };

  const effect = requestEffect(
    apiClient.post('/transactions', {
      body: { data: payload },
    }),
  ).pipe(
    Effect.map(() => {
      updateTag(CACHE_TAGS.TRANSACTIONS);
      return { success: true, error: null };
    }),
    Effect.catchAll((error) =>
      Effect.succeed({
        success: false,
        error: error.message || TRANSACTION_ERRORS.CREATE_TRANSACTION_FAILED,
      }),
    ),
    Effect.withSpan('createTransaction', {
      attributes: { cardDocumentId: data.cardDocumentId, type: data.type },
    }),
  );

  return runServerEffect(effect);
};
