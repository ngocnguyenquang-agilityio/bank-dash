'use server';

// Libraries
import { Effect } from 'effect';
import { revalidatePath } from 'next/cache';

// Services
import { apiClient } from '@/services/api';
import { requestEffect, ApiRequestError } from '@/services/api.effect';
import { runServerEffect } from '@/lib/effect/runtime';

// Types
import { Transactions, type Card } from '@/types/card';

// Constants
import { TRANSACTION_ERRORS } from '@/constants/error';

interface SendAmountResult {
  success: boolean;
  error: string | null;
}

export const sendAmount = async (
  cardDocumentId: string,
  amount: number,
  recipientName: string,
): Promise<SendAmountResult> => {
  if (amount <= 0) {
    return { success: false, error: TRANSACTION_ERRORS.INVALID_AMOUNT };
  }

  const effect = Effect.gen(function* () {
    // Fetch card to read current balance
    const { data: card } = yield* requestEffect(
      apiClient.get<{ data: Card }>(`/cards/${cardDocumentId}?populate=*`),
    );

    const currentBalance = parseFloat(card.balance);

    if (currentBalance < amount) {
      return yield* Effect.fail(
        new ApiRequestError({ message: TRANSACTION_ERRORS.INSUFFICIENT_BALANCE }),
      );
    }

    const newBalance = (currentBalance - amount).toFixed(2);

    // Update balance and create transaction concurrently via Effect fibers
    yield* Effect.all(
      [
        requestEffect(
          apiClient.put(`/cards/${cardDocumentId}`, {
            body: { data: { balance: newBalance } },
          }),
        ),
        requestEffect(
          apiClient.post('/transactions', {
            body: {
              data: {
                message: `Transfer to ${recipientName}`,
                amount,
                type: Transactions.Withdrawal,
                card: cardDocumentId,
                date: new Date().toISOString().split('T')[0],
              },
            },
          }),
        ),
      ],
      { concurrency: 'unbounded' },
    );

    revalidatePath('/dashboard');
    return { success: true, error: null } satisfies SendAmountResult;
  }).pipe(
    Effect.catchAll((error) =>
      Effect.succeed<SendAmountResult>({
        success: false,
        error: error.message || TRANSACTION_ERRORS.FAILED_TRANSACTION,
      }),
    ),
  );

  return runServerEffect(effect);
};
