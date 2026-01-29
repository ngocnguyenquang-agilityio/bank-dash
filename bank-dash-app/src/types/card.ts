import { Schema } from 'effect';

export enum Transactions {
  Deposit = 'deposit',
  Withdrawal = 'withdrawal',
}

const transactionSchema = Schema.Enums(Transactions);

export type TransactionType = typeof transactionSchema.Type;

export const CardSchema = Schema.Struct({
  id: Schema.Number,
  documentId: Schema.String,
  number: Schema.String,
  name: Schema.String,
  expiration: Schema.String,
  balance: Schema.String,
  isActive: Schema.Boolean,
  isPhysical: Schema.Boolean,
  bank: Schema.String,
  variant: Schema.Literal('gradient-blue', 'gradient-purple', 'white'),
  gradientColor: Schema.optional(Schema.Literal('blue', 'pink', 'yellow')),
  createdAt: Schema.String,
  updatedAt: Schema.String,
  publishedAt: Schema.optional(Schema.String),
  member: Schema.optional(Schema.Unknown),
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

// Transformed/Display Types
export const MyCardSchema = Schema.Struct({
  id: Schema.String,
  balance: Schema.String,
  name: Schema.String,
  cardNumber: Schema.String,
  expiration: Schema.String,
  variant: Schema.Literal('gradient-blue', 'gradient-purple', 'white'),
});

export const CardListItemSchema = Schema.Struct({
  id: Schema.String,
  bank: Schema.String,
  cardNumber: Schema.String,
  nameOnCard: Schema.String,
  gradientColor: Schema.Literal('blue', 'pink', 'yellow'),
});

// Types
export type Card = typeof CardSchema.Type;
export type CardsResponse = typeof CardsResponseSchema.Type;
export type MyCard = typeof MyCardSchema.Type;
export type CardListItem = typeof CardListItemSchema.Type;
