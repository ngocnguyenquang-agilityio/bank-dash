'use server';

// Libraries
import { Effect } from 'effect';
import { updateTag } from 'next/cache';

// Services
import { apiClient } from '@/services/api';
import { requestEffect } from '@/services/api.effect';
import { runServerEffect } from '@/lib/effect/runtime';

// Constants
import { TRANSACTION_ERRORS } from '@/constants/error';
import { CACHE_TAGS } from '@/constants/cache';

interface SendAmountResult {
  success: boolean;
  error: string | null;
}

export const sendAmount = async (
  senderClerkId: string,
  recipientClerkId: string,
  amount: number,
  senderName: string,
  recipientName: string,
): Promise<SendAmountResult> => {
  if (amount <= 0) {
    return { success: false, error: TRANSACTION_ERRORS.INVALID_AMOUNT };
  }

  const effect = requestEffect<{ data: SendAmountResult }>(
    apiClient.post('/transfers', {
      body: {
        data: {
          senderClerkId,
          recipientClerkId,
          amount,
          senderName,
          recipientName,
        },
      },
    }),
  ).pipe(
    Effect.tap((response) => {
      if (response.data.success) {
        updateTag(CACHE_TAGS.CARDS);
        updateTag(CACHE_TAGS.TRANSACTIONS);
      }
      return Effect.void;
    }),
    Effect.map((response) => response.data),
    Effect.catchAll((error) =>
      Effect.succeed<SendAmountResult>({
        success: false,
        error: error.message || TRANSACTION_ERRORS.FAILED_TRANSACTION,
      }),
    ),
    Effect.withSpan('sendAmount', {
      attributes: { senderClerkId, recipientClerkId, amount },
    }),
  );

  return runServerEffect(effect);
};
