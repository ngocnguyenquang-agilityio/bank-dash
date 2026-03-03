'use server';

// Libraries
import { Effect } from 'effect';
import { revalidatePath } from 'next/cache';

// Services
import { apiClient } from '@/services/api';
import { requestEffect, ApiRequestError } from '@/services/api.effect';
import { getCardsEffect } from '@/services/cards.effect';
import { runServerEffect } from '@/lib/effect/runtime';

// Types
import { Transactions } from '@/types/card';

// Constants
import { TRANSACTION_ERRORS } from '@/constants/error';

interface SendAmountResult {
  success: boolean;
  error: string | null;
}

export const sendAmount = async (
  userClerkId: string,
  amount: number,
  recipientName: string,
): Promise<SendAmountResult> => {
  if (amount <= 0) {
    return { success: false, error: TRANSACTION_ERRORS.INVALID_AMOUNT };
  }

  const effect = Effect.gen(function* () {
    // Fetch all cards for the user
    const { cards, error: cardsError } = yield* getCardsEffect(userClerkId, 1, 100);

    if (cardsError || !cards) {
      return yield* Effect.fail(
        new ApiRequestError({ message: cardsError || TRANSACTION_ERRORS.FAILED_TRANSACTION }),
      );
    }

    // Find the first active card with sufficient balance
    const activeCards = cards.data.filter((card) => card.isActive);

    if (activeCards.length === 0) {
      return yield* Effect.fail(
        new ApiRequestError({ message: TRANSACTION_ERRORS.ALL_CARDS_BLOCKED }),
      );
    }

    const targetCard = activeCards.find((card) => parseFloat(card.balance) >= amount);

    if (!targetCard) {
      return yield* Effect.fail(
        new ApiRequestError({ message: TRANSACTION_ERRORS.INSUFFICIENT_BALANCE }),
      );
    }

    const newBalance = (parseFloat(targetCard.balance) - amount).toFixed(2);

    // Create transaction first, then update balance only on success
    // Sequential to prevent inconsistent state (balance deducted without transaction)
    yield* requestEffect(
      apiClient.post('/transactions', {
        body: {
          data: {
            message: `Transfer to ${recipientName}`,
            amount,
            type: Transactions.Withdrawal,
            card: targetCard.documentId,
            date: new Date().toISOString().split('T')[0],
          },
        },
      }),
    );

    yield* requestEffect(
      apiClient.put(`/cards/${targetCard.documentId}`, {
        body: { data: { balance: newBalance } },
      }),
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
