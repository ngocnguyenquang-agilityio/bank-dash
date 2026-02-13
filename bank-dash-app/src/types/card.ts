// Libraries
import { Schema } from 'effect';

// Constants
import { REGEX } from '@/constants/regex';

export enum CardTypes {
  Physical = 'physical',
  Virtual = 'virtual',
}

export enum Transactions {
  Deposit = 'deposit',
  Withdrawal = 'withdrawal',
}

export const TransactionSchema = Schema.Enums(Transactions);

export type TransactionType = typeof TransactionSchema.Type;

export const CardSchema = Schema.Struct({
  id: Schema.Number,
  documentId: Schema.String,
  number: Schema.String.pipe(
    Schema.minLength(1, { message: () => 'Card number is required' }),
    Schema.pattern(REGEX.CARD_NUMBER, {
      message: () => 'Invalid card number format',
    }),
  ),
  name: Schema.String.pipe(Schema.minLength(1, { message: () => 'Name on card is required' })),
  expiration: Schema.String.pipe(
    Schema.minLength(1, { message: () => 'Expiration date is required' }),
  ),
  balance: Schema.String,
  isActive: Schema.Boolean,
  isPhysical: Schema.Boolean,
  address: Schema.optional(Schema.String),
  createdAt: Schema.String,
  updatedAt: Schema.String,
  publishedAt: Schema.optional(Schema.String),
  member: Schema.optional(Schema.Unknown),
});

// Schema for creating a new card (form input)
export const CardFormSchema = Schema.Struct({
  isPhysical: Schema.optional(Schema.Boolean),
  isActive: Schema.optional(Schema.Boolean),
  nameOnCard: Schema.String.pipe(
    Schema.minLength(1, { message: () => 'Name on card is required' }),
  ),
  cardNumber: Schema.String.pipe(
    Schema.minLength(1, { message: () => 'Card number is required' }),
    Schema.maxLength(19, { message: () => 'The maximum number is 16 digits' }),
    Schema.pattern(REGEX.CARD_NUMBER, {
      message: () => 'Invalid card number format',
    }),
  ),
  expiration: Schema.String.pipe(
    Schema.minLength(1, { message: () => 'Expiration date is required' }),
  ),
  address: Schema.optional(Schema.String),
});

export const CardsResponseSchema = Schema.Struct({
  data: Schema.Array(CardSchema),
  meta: Schema.Struct({
    pagination: Schema.Struct({
      page: Schema.Number,
      pageSize: Schema.Number,
      pageCount: Schema.Number,
      total: Schema.Number,
    }),
  }),
});

// Types
export type Card = typeof CardSchema.Type;
export type CardFormData = typeof CardFormSchema.Type;
export type CardsResponse = typeof CardsResponseSchema.Type;
