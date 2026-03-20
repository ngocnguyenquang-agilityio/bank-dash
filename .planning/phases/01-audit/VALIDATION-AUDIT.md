# Card Number Validation Audit
**Date:** 2026-03-20
**Phase:** 01-audit (AUDIT-01, AUDIT-02)
**Scope:** All files that validate, constrain, or format the card number field

---

## Client-Side Validation

### Location 1: `bank-dash-app/src/constants/regex.ts`

- **Mechanism:** Exported constant `REGEX.CARD_NUMBER`
- **Pattern:** `/^\d{4}-?\d{4}-?\d{4}-?\d{4}$/`
- **Rule:** Requires exactly 16 digits, optionally separated by dashes into 4 groups of 4. Enforces digits-only (no letters or special characters).
- **Used by:** `CardSchema` in `src/types/card.ts`

### Location 2: `bank-dash-app/src/types/card.ts` — `CardSchema` (lines 24-28)

- **Mechanism:** Effect-TS `Schema.pattern(REGEX.CARD_NUMBER, ...)` on the `number` field
- **Rule:** Validates API response data matches the 16-digit (with optional dashes) pattern. Error message: "Invalid card number format"
- **Used by:** `CardsResponseSchema` which wraps `CardSchema` in an array — used when parsing GET /cards responses
- **Note:** This is response validation, not input validation. It validates data coming FROM the server.

### Location 3: `bank-dash-app/src/types/card.ts` — `CardFormSchema` (lines 51-53)

- **Mechanism:** Effect-TS `Schema.minLength(1)` + `Schema.maxLength(19)` on the `cardNumber` field
- **Rule:** Requires at least 1 character (non-empty). Maximum 19 characters (16 digits + 3 dashes in formatted form `1234-5678-9012-3456`). Error messages: "Card number is required" / "The maximum number is 16 digits"
- **Used by:** `AddCardModal` via react-hook-form `effectTsResolver(CardFormSchema)` — this is the form-level validation
- **Note:** This does NOT enforce digits-only at the schema level. The digits-only enforcement happens via the `formatCardNumber` function in AddCardModal.

### Location 4: `bank-dash-app/src/components/AddCardModal/AddCardModal.tsx` — `formatCardNumber` function (lines 84-95)

- **Mechanism:** JavaScript string manipulation in the `onChange` handler of the card number input
- **Rule:**
  - (a) Strips all non-digit characters via `value.replace(/\D/g, '')`
  - (b) Truncates to 16 digits via `digitsOnly.slice(0, 16)`
  - (c) Inserts dashes every 4 digits via regex replace `(/(\d{4})(?=\d)/g, '$1-')`
- **Used by:** The `<Controller name="cardNumber">` `onChange` handler (line 227)
- **Note:** This is the real-time input filter. It prevents non-digits from ever reaching the form state and caps length at 16 digits.

---

## Server-Side Validation

### Location 5: `bank-dash-server/src/api/card/content-types/card/schema.json` — `number` attribute (lines 27-31)

- **Mechanism:** Strapi schema `regex` property on the `number` field
- **Pattern:** `"^[0-9]{16}$"`
- **Rule:** Requires exactly 16 digits (0-9), no dashes, no other characters. Also has `"required": true` so the field cannot be null/empty.
- **Triggered when:** Strapi processes POST /cards or PUT /cards/:id requests — Strapi validates the request body against this schema before saving to the database.
- **Note:** The frontend strips dashes before submission (`data.cardNumber.replace(/-/g, '')` in AddCardModal line 116), so the value arriving at Strapi should be 16 raw digits matching this regex.

---

## Data Flow Summary

Validation chain for a card number from user input to database:

**Input path:**

1. User types in AddCardModal card number field
2. `formatCardNumber` strips non-digits and caps at 16 digits (Location 4)
3. react-hook-form validates via `CardFormSchema` — checks minLength(1) and maxLength(19) (Location 3)
4. On submit, `AddCardModal.onSubmit` strips dashes: `data.cardNumber.replace(/-/g, '')`
5. `cards.ts` `addCard` sends raw digits to POST /cards as `number` field
6. Strapi validates `number` field against regex `^[0-9]{16}$` (Location 5)
7. If valid, saved to SQLite database

**Read-back path:**

1. GET /cards returns `number` field (16 raw digits from DB)
2. `CardsResponseSchema` validates response via `CardSchema.number` using `REGEX.CARD_NUMBER` (Location 2)

---

## Observations for Phase 2

- The `formatCardNumber` function in AddCardModal is the primary real-time guard (prevents non-digits, caps at 16)
- `CardFormSchema.maxLength(19)` is a secondary guard (allows the formatted string with dashes)
- `CardFormSchema` does NOT enforce digits-only or the exact 16-digit pattern — it relies on `formatCardNumber` for that
- The Strapi `regex: "^[0-9]{16}$"` is the only server-side validation — it is redundant with the client-side formatting
- `CardSchema` validates response data, not input — it exists to ensure the API returns expected shapes
- `REGEX.CARD_NUMBER` in `constants/regex.ts` is only consumed by `CardSchema` (response validation), not by form input validation
- The `handleApiError` utility in `src/lib/errors/handleApiError.ts` parses Strapi `ValidationError` responses into field-level errors, so if the server regex rejects a card number, the error would surface as a field error — but with client formatting in place, this path is rarely hit

---

## File Index

| File | Line(s) | Mechanism | Rule Summary | Side |
|------|---------|-----------|--------------|------|
| `bank-dash-app/src/constants/regex.ts` | 2 | Regex constant | 16 digits, optional dashes in 4-4-4-4 groups | Client |
| `bank-dash-app/src/types/card.ts` | 24-28 | Effect Schema.pattern | Response must match CARD_NUMBER regex | Client |
| `bank-dash-app/src/types/card.ts` | 51-53 | Effect Schema.minLength/maxLength | Non-empty, max 19 chars (16 digits + 3 dashes) | Client |
| `bank-dash-app/src/components/AddCardModal/AddCardModal.tsx` | 84-95 | JS string replace + slice | Strip non-digits, cap at 16 digits, insert dashes | Client |
| `bank-dash-server/src/api/card/content-types/card/schema.json` | 27-31 | Strapi schema regex | Exactly 16 digits [0-9], required field | Server |
