// Libraries
import { Schema } from 'effect';

export const MemberSchema = Schema.Struct({
  id: Schema.Number,
  documentId: Schema.String,
  clerkId: Schema.String,
  name: Schema.String,
});

export const MembersResponseSchema = Schema.Struct({
  data: Schema.Array(MemberSchema),
  meta: Schema.Struct({
    pagination: Schema.Struct({
      page: Schema.Number,
      pageSize: Schema.Number,
      pageCount: Schema.Number,
      total: Schema.Number,
    }),
  }),
});

export type Member = typeof MemberSchema.Type;
export type MembersResponse = typeof MembersResponseSchema.Type;
