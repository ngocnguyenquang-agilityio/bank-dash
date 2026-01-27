import { Schema } from 'effect';

export enum Transactions {
  Deposit = 'deposit',
  Withdrawal = 'withdrawal',
}

const transactionSchema = Schema.Enums(Transactions);

export type TransactionType = typeof transactionSchema.Type;
