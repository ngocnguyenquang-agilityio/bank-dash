'use server';

// Libraries
import { Effect } from 'effect';
import { updateTag } from 'next/cache';

// Services
import { apiClient } from '@/services/api';
import { requestEffect, ApiRequestError } from '@/services/api.effect';
import { getCardsEffect } from '@/services/cards.effect';
import { runServerEffect } from '@/lib/effect/runtime';

// Types
import { Transactions } from '@/types/card';

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

  const effect = Effect.gen(function* () {
    // Fetch cards for both sender and recipient in parallel
    const [senderCardsResult, recipientCardsResult] = yield* Effect.all(
      [getCardsEffect(senderClerkId, 1, 100), getCardsEffect(recipientClerkId, 1, 100)],
      { concurrency: 'unbounded' },
    );

    // Validate sender cards
    if (senderCardsResult.error || !senderCardsResult.cards) {
      return yield* Effect.fail(
        new ApiRequestError({
          message: senderCardsResult.error || TRANSACTION_ERRORS.FAILED_TRANSACTION,
        }),
      );
    }

    const senderActiveCards = senderCardsResult.cards.data.filter((card) => card.isActive);

    if (senderActiveCards.length === 0) {
      return yield* Effect.fail(
        new ApiRequestError({ message: TRANSACTION_ERRORS.ALL_CARDS_BLOCKED }),
      );
    }

    const senderCard = senderActiveCards.find((card) => parseFloat(card.balance) >= amount);

    if (!senderCard) {
      return yield* Effect.fail(
        new ApiRequestError({ message: TRANSACTION_ERRORS.INSUFFICIENT_BALANCE }),
      );
    }

    // Validate recipient cards
    if (recipientCardsResult.error || !recipientCardsResult.cards) {
      return yield* Effect.fail(
        new ApiRequestError({
          message: recipientCardsResult.error || TRANSACTION_ERRORS.RECIPIENT_NOT_FOUND,
        }),
      );
    }

    const recipientActiveCards = recipientCardsResult.cards.data.filter((card) => card.isActive);

    if (recipientActiveCards.length === 0) {
      return yield* Effect.fail(
        new ApiRequestError({ message: TRANSACTION_ERRORS.RECIPIENT_NO_ACTIVE_CARD }),
      );
    }

    const recipientCard = recipientActiveCards[0]!;

    // Calculate new balances
    const senderNewBalance = (parseFloat(senderCard.balance) - amount).toFixed(2);
    const recipientNewBalance = (parseFloat(recipientCard.balance) + amount).toFixed(2);

    // Step 1: Create sender withdrawal transaction
    const senderTransaction = yield* requestEffect<{ data: { documentId: string } }>(
      apiClient.post('/transactions', {
        body: {
          data: {
            message: `Transfer to ${recipientName}`,
            amount,
            type: Transactions.Withdrawal,
            card: senderCard.documentId,
            date: new Date().toISOString().split('T')[0],
          },
        },
      }),
    );

    // Step 2: Update sender card balance
    yield* requestEffect(
      apiClient.put(`/cards/${senderCard.documentId}`, {
        body: { data: { balance: senderNewBalance } },
      }),
    ).pipe(
      Effect.catchAll((error) =>
        // Rollback step 1: delete sender transaction
        Effect.gen(function* () {
          yield* requestEffect(
            apiClient.delete(`/transactions/${senderTransaction.data.documentId}`),
          ).pipe(Effect.catchAll(() => Effect.void));

          return yield* Effect.fail(error);
        }),
      ),
    );

    // Step 3: Create recipient deposit transaction
    const recipientTransaction = yield* requestEffect<{ data: { documentId: string } }>(
      apiClient.post('/transactions', {
        body: {
          data: {
            message: `Receive from ${senderName}`,
            amount,
            type: Transactions.Deposit,
            card: recipientCard.documentId,
            date: new Date().toISOString().split('T')[0],
          },
        },
      }),
    ).pipe(
      Effect.catchAll((error) =>
        // Rollback steps 1-2: restore sender balance and delete sender transaction
        Effect.gen(function* () {
          yield* requestEffect(
            apiClient.put(`/cards/${senderCard.documentId}`, {
              body: { data: { balance: senderCard.balance } },
            }),
          ).pipe(Effect.catchAll(() => Effect.void));

          yield* requestEffect(
            apiClient.delete(`/transactions/${senderTransaction.data.documentId}`),
          ).pipe(Effect.catchAll(() => Effect.void));

          return yield* Effect.fail(error);
        }),
      ),
    );

    // Step 4: Update recipient card balance
    yield* requestEffect(
      apiClient.put(`/cards/${recipientCard.documentId}`, {
        body: { data: { balance: recipientNewBalance } },
      }),
    ).pipe(
      Effect.catchAll((error) =>
        // Rollback steps 1-3: restore sender balance, delete both transactions
        Effect.gen(function* () {
          yield* requestEffect(
            apiClient.put(`/cards/${senderCard.documentId}`, {
              body: { data: { balance: senderCard.balance } },
            }),
          ).pipe(Effect.catchAll(() => Effect.void));

          yield* requestEffect(
            apiClient.delete(`/transactions/${senderTransaction.data.documentId}`),
          ).pipe(Effect.catchAll(() => Effect.void));

          yield* requestEffect(
            apiClient.delete(`/transactions/${recipientTransaction.data.documentId}`),
          ).pipe(Effect.catchAll(() => Effect.void));

          return yield* Effect.fail(error);
        }),
      ),
    );

    updateTag(CACHE_TAGS.CARDS);
    updateTag(CACHE_TAGS.TRANSACTIONS);
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
