// Libraries
import { Schema } from 'effect';

// Strapi media object schema
export const StrapiMediaSchema = Schema.Struct({
  id: Schema.Number,
  documentId: Schema.String,
  url: Schema.String,
  name: Schema.optional(Schema.String),
  alternativeText: Schema.optional(Schema.NullOr(Schema.String)),
  width: Schema.optional(Schema.Number),
  height: Schema.optional(Schema.Number),
});

export type StrapiMedia = typeof StrapiMediaSchema.Type;

export const MemberSchema = Schema.Struct({
  id: Schema.Number,
  documentId: Schema.String,
  clerkId: Schema.String,
  name: Schema.String,
  userName: Schema.optional(Schema.NullOr(Schema.String)),
  email: Schema.optional(Schema.NullOr(Schema.String)),
  dob: Schema.optional(Schema.NullOr(Schema.String)),
  presentAddress: Schema.optional(Schema.NullOr(Schema.String)),
  permanentAddress: Schema.optional(Schema.NullOr(Schema.String)),
  city: Schema.optional(Schema.NullOr(Schema.String)),
  postalCode: Schema.optional(Schema.NullOr(Schema.String)),
  country: Schema.optional(Schema.NullOr(Schema.String)),
  photo: Schema.optional(Schema.NullOr(StrapiMediaSchema)),
});

export const MemberProfileSchema = Schema.Struct({
  name: Schema.String.pipe(Schema.minLength(1, { message: () => 'Name is required' })),
  userName: Schema.String.pipe(Schema.minLength(1, { message: () => 'User Name is required' })),
  email: Schema.String.pipe(
    Schema.minLength(1, { message: () => 'Email is required' }),
    Schema.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: () => 'Invalid email address' }),
  ),
  dob: Schema.optional(Schema.String),
  presentAddress: Schema.optional(Schema.String),
  permanentAddress: Schema.optional(Schema.String),
  city: Schema.optional(Schema.String),
  postalCode: Schema.optional(Schema.String),
  country: Schema.optional(Schema.String),
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
export type MemberProfile = typeof MemberProfileSchema.Type;
export type MembersResponse = typeof MembersResponseSchema.Type;
