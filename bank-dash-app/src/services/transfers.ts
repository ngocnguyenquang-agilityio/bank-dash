'use server';

// Services
import { getCardDetails, updateCardBalance } from '@/services/cards';
import { createTransaction } from '@/services/transactions';

// Types
import { Transactions } from '@/types/card';

// Constants
import { NOT_FOUND_ERRORS, TRANSACTION_ERRORS } from '@/constants/error';

interface SendAmountResult {
  success: boolean;
  error: string | null;
}

export const sendAmount = async (
  cardDocumentId: string,
  amount: number,
  recipientName: string,
): Promise<SendAmountResult> => {
  // Validate amount
  if (amount <= 0) {
    return { success: false, error: TRANSACTION_ERRORS.INVALID_AMOUNT };
  }

  // Fetch current card details
  const { card, error: fetchError } = await getCardDetails(cardDocumentId);

  if (fetchError || !card) {
    return { success: false, error: fetchError || NOT_FOUND_ERRORS.CARD_NOT_FOUND };
  }

  const currentBalance = parseFloat(card.balance);

  // Check if balance is sufficient
  if (currentBalance < amount) {
    return { success: false, error: TRANSACTION_ERRORS.INSUFFICIENT_BALANCE };
  }

  // Calculate new balance
  const newBalance = (currentBalance - amount).toFixed(2);

  // Update card balance
  const { success: updateSuccess, error: updateError } = await updateCardBalance(
    cardDocumentId,
    newBalance,
  );

  if (!updateSuccess) {
    return { success: false, error: updateError || TRANSACTION_ERRORS.FAILED_TRANSACTION };
  }

  // Create transaction record
  const { success: txSuccess, error: txError } = await createTransaction({
    cardDocumentId,
    amount,
    message: `Transfer to ${recipientName}`,
    type: Transactions.Withdrawal,
  });

  if (!txSuccess) {
    // Note: In a real app, we'd want to rollback the balance update here
    return { success: false, error: txError || TRANSACTION_ERRORS.FAILED_TRANSACTION };
  }

  return { success: true, error: null };
};
