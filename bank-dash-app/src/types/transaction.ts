// Libraries
import { Schema } from 'effect';

// Types
import { TransactionSchema } from '@/types/card';

export const TransactionItemSchema = Schema.Struct({
  id: Schema.Number,
  documentId: Schema.String,
  message: Schema.String,
  date: Schema.optional(Schema.String),
  amount: Schema.Number,
  type: TransactionSchema,
  icon: Schema.optional(Schema.String),
  iconBg: Schema.optional(Schema.String),
  createdAt: Schema.String,
  updatedAt: Schema.String,
  publishedAt: Schema.optional(Schema.String),
  card: Schema.optional(Schema.Unknown),
});

export const TransactionsResponseSchema = Schema.Struct({
  data: Schema.Array(TransactionItemSchema),
  meta: Schema.Struct({
    pagination: Schema.Struct({
      page: Schema.Number,
      pageSize: Schema.Number,
      pageCount: Schema.Number,
      total: Schema.Number,
    }),
  }),
});

export type Transaction = typeof TransactionItemSchema.Type;
export type TransactionsResponse = typeof TransactionsResponseSchema.Type;
