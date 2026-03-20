# bank-dash

## What This Is

A personal banking dashboard web application that lets users manage their cards, view transactions, and transfer funds between cards. Built as a Next.js 16 frontend with a Strapi 5 headless CMS backend, using Clerk for authentication. Card number validation is now handled exclusively client-side via Zod schema pattern validation.

## Core Value

Users can view and manage their cards and transactions with immediate, accurate feedback when entering card data.

## Requirements

### Validated

- ✓ User authentication (sign in, sign up, sign out) via Clerk — existing
- ✓ Card listing and display (CreditCard component, card service) — existing
- ✓ Card creation via AddCardModal — existing
- ✓ Transaction listing — existing
- ✓ Fund transfers between cards (atomic, database-transactional) — existing
- ✓ Quick transfer UI with member avatars — existing
- ✓ Settings page — existing
- ✓ Card number validation audited (client-side and server-side rules documented) — v1.0
- ✓ Card number validation handled client-side only (faster UX feedback, no server round-trip) — v1.0
- ✓ Server-side card number validation removed from Strapi backend — v1.0

### Active

(None — planning next milestone)

### Out of Scope

- Server-side card number validation — moved to client-side only for better UX (v1.0)
- Other form validation improvements — not in current scope
- Luhn algorithm check — deferred (ENH-01)
- Card type detection (Visa/Mastercard/Amex) from prefix — deferred (ENH-02)

## Context

Monorepo: `bank-dash-app/` (Next.js 16, strict TypeScript, Effect-TS for async) and `bank-dash-server/` (Strapi 5, SQLite). Card operations go through `src/services/cards.ts` on the frontend and the auto-generated `card` collection on the backend. Card types and Zod schemas are in `bank-dash-app/src/types/card.ts`.

Shipped v1.0 with 13,145 LOC TypeScript/JS. Tech stack: Next.js 16, Strapi 5, Clerk, Effect-TS, React Hook Form, Zod.

`AddCardModal.tsx` remains at ~343 lines — card number validation was successfully isolated to `CardFormSchema` in `types/card.ts` without increasing component complexity.

## Constraints

- **Tech Stack**: Next.js 16 + Strapi 5 — no framework changes
- **Validation Location**: Client-side only — do not add new server-side card number checks
- **Scope**: Card number validation field only — not a broader forms/validation overhaul

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Client-side card number validation only | Faster user feedback without server round-trips | ✓ Good — inline errors work, 248/248 tests pass |
| `Schema.pattern` on formatted (dashed) value | `formatCardNumber` writes dashed string to RHF field; schema sees formatted value | ✓ Good — validates what the schema actually receives |
| `maxLength(19)` kept alongside `Schema.pattern` | Belt-and-suspenders: early-exit guard before regex evaluation | ✓ Good — no functional overlap, belt-and-suspenders is fine |
| Remove regex from Strapi (not change it) | Server should not duplicate client-side format rules | ✓ Good — clean separation of concerns |

---
*Last updated: 2026-03-20 after v1.0 milestone*
