# Phase 2: Implement - Research

**Researched:** 2026-03-20
**Domain:** React Hook Form + Effect-TS Schema validation, Strapi 5 content-type schema
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CLIENT-01 | User sees an error if card number exceeds 16 digits (validated client-side before submission) | `CardFormSchema` maxLength already enforces 19 chars; must tighten to enforce exactly 16 raw digits. `formatCardNumber` already truncates at 16 digits via `slice(0, 16)` — the truncation itself already satisfies "cannot type more than 16 digits". |
| CLIENT-02 | Card number input prevents or rejects non-numeric characters | `formatCardNumber` already strips non-digits via `value.replace(/\D/g, '')`. This is already working; the requirement is met by the existing `onChange` handler and needs no new logic, only verification. |
| CLIENT-03 | Validation feedback is shown inline (real-time or on submit) without a server round-trip | The react-hook-form `Controller` + `effectTsResolver` pattern in `AddCardModal` already displays `errors.cardNumber.message` inline. `CardFormSchema` must carry accurate validation messages for both rules. No server round-trip is involved in form validation. |
| SERVER-01 | Strapi backend does not perform card number validation (all rules removed) | Single change: remove `"regex": "^[0-9]{16}$"` from the `number` attribute in `bank-dash-server/src/api/card/content-types/card/schema.json`. The `"required": true` constraint should remain. |
| SERVER-02 | Removing server-side validation does not break existing card creation or update flows | `addCard` in `cards.ts` strips dashes before submission (`data.cardNumber.replace(/-/g, '')`). With the regex removed from Strapi, a 16-digit string still saves correctly — only the regex rejection path disappears. End-to-end flow is unaffected. |
</phase_requirements>

---

## Summary

Phase 2 has a narrow, well-defined surface area. The audit from Phase 1 reveals that the primary client-side guard (`formatCardNumber` in `AddCardModal.tsx`) already does the right thing: it strips non-digits and caps at 16 digits in the `onChange` handler. The schema (`CardFormSchema`) currently uses `maxLength(19)` to accommodate the formatted string (`1234-5678-9012-3456`), which is correct and must be preserved, but it does not enforce exact 16-digit completion or validate the pattern at the schema level. Inline error display already works through the existing `errors.cardNumber` render path.

The server-side change is a one-line JSON edit: removing `"regex": "^[0-9]{16}$"` from the Strapi card schema. The `"required": true` constraint stays. Because the client already strips dashes before submission, the Strapi field continues to receive a 16-raw-digit string and saves without issue.

The main planning question is whether `CardFormSchema` needs a tighter pattern validator added (e.g., requiring exactly 16 digits when dashes are stripped), and whether tests need updating to cover the validation messaging explicitly. The schema and the `formatCardNumber` function work as a complementary pair; they should not be treated as independent guards.

**Primary recommendation:** Leave `formatCardNumber` untouched (it already satisfies CLIENT-01 and CLIENT-02 as a real-time input filter). Tighten `CardFormSchema.cardNumber` to add a pattern validator that enforces exactly 16 digits (ignoring dashes) so the schema itself documents the rule and produces the correct error message for CLIENT-01/CLIENT-03. Remove the Strapi regex. Update existing tests to verify the new schema message.

---

## Standard Stack

### Core (already in use — no new installs)

| Library | Version | Purpose | Note |
|---------|---------|---------|------|
| `react-hook-form` | In use | Form state and submit handling | `Controller` wraps card number input |
| `@hookform/resolvers/effect-ts` | In use | Connects Effect-TS Schema to RHF | `effectTsResolver(CardFormSchema)` |
| `effect` (Schema) | In use | Schema validation and type inference | `Schema.pattern`, `Schema.maxLength` |

No new packages are required for this phase. All validation tools are already present.

**Installation:** None needed.

---

## Architecture Patterns

### Relevant Project Structure

```
bank-dash-app/src/
├── constants/
│   └── regex.ts                  # REGEX.CARD_NUMBER — used only in CardSchema (response validation)
├── types/
│   └── card.ts                   # CardSchema (response) + CardFormSchema (form input)
└── components/
    └── AddCardModal/
        ├── AddCardModal.tsx       # formatCardNumber + Controller + errors.cardNumber render
        └── AddCardModal.test.tsx  # Existing test: "formats card number with dashes as user types"

bank-dash-server/src/api/card/content-types/card/
└── schema.json                   # Strapi content-type definition — remove "regex" from "number"
```

### Pattern 1: Effect-TS Schema as the single source of validation truth

`CardFormSchema` in `card.ts` is the authoritative contract for form input. `effectTsResolver` wires it into react-hook-form so error messages come from the schema. The `formatCardNumber` function is a UI-level formatter (prevents bad input from reaching form state), not a validator — it does not produce error messages.

**Rule:** Validation messages that must appear to the user should come from `CardFormSchema`, not from `formatCardNumber`. The formatter is silent; the schema is the error source.

**Current `CardFormSchema.cardNumber`:**
```typescript
// Source: bank-dash-app/src/types/card.ts lines 51-53
cardNumber: Schema.String.pipe(
  Schema.minLength(1, { message: () => 'Card number is required' }),
  Schema.maxLength(19, { message: () => 'The maximum number is 16 digits' }),
),
```

**What to add** — a `Schema.pattern` that verifies the value is a complete 16-digit card number (with or without dashes):
```typescript
cardNumber: Schema.String.pipe(
  Schema.minLength(1, { message: () => 'Card number is required' }),
  Schema.maxLength(19, { message: () => 'The maximum number is 16 digits' }),
  Schema.pattern(/^\d{4}-\d{4}-\d{4}-\d{4}$/, {
    message: () => 'Card number must be 16 digits',
  }),
),
```

This pattern fires only when the user has typed fewer than 16 digits and tries to submit, satisfying CLIENT-01 and CLIENT-03 without any server round-trip.

### Pattern 2: Strapi content-type schema edit

Remove only the `"regex"` key. Leave `"required": true`, `"type": "string"`, and all other attributes untouched.

**Before:**
```json
"number": {
  "type": "string",
  "required": true,
  "regex": "^[0-9]{16}$"
}
```

**After:**
```json
"number": {
  "type": "string",
  "required": true
}
```

Strapi 5 reads `schema.json` at startup. The change takes effect after restarting the dev server; no migration or admin rebuild is needed for removing a validator.

### Pattern 3: react-hook-form validation timing

RHF with `effectTsResolver` triggers schema validation on submit by default. The `formatCardNumber` `onChange` handler runs on every keystroke. This means:
- Non-digits and excess length are blocked silently as the user types (CLIENT-02 satisfied without any error message).
- Schema pattern error ("Card number must be 16 digits") appears on submit attempt if user hasn't completed 16 digits (CLIENT-01, CLIENT-03 satisfied).

This is the correct UX: silent input filtering during typing, clear error on submit if incomplete.

### Anti-Patterns to Avoid

- **Adding validation inside `formatCardNumber`:** That function is a formatter, not a validator. Mixing concerns would make it return error state, which breaks the react-hook-form model.
- **Duplicating the 16-digit rule in `CardSchema` (response schema):** `CardSchema` validates API responses, not form input. Do not change it — it must remain accurate for GET /cards parsing.
- **Changing `REGEX.CARD_NUMBER`:** This constant is used only in `CardSchema` for response validation. It must not be changed or repurposed for form input.
- **Removing `"required": true` from Strapi schema:** SERVER-01 only asks to remove the regex validator. The `required` constraint is unrelated and should stay.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Schema-to-form bridge | Custom validation adapter | `effectTsResolver` (already wired) | Already in use; handles error message extraction automatically |
| Input character filtering | keydown event handler | `formatCardNumber` `onChange` (already in use) | Already handles non-digit stripping and length cap; adding a keydown handler would duplicate and conflict |
| Schema pattern validation | Custom `validate` function in RHF | `Schema.pattern` in Effect-TS Schema | Keeps all rules in the schema, consistent with project pattern |

---

## Common Pitfalls

### Pitfall 1: Forgetting that `formatCardNumber` operates on the formatted value

**What goes wrong:** `formatCardNumber` receives the formatted value (e.g., `"1234-5678-9012-345"`) because `field.value` already has dashes. Strip logic `value.replace(/\D/g, '')` handles this correctly, but any new validation that operates on the raw input must account for dashes too.

**How to avoid:** Any schema pattern for the card number must match the formatted form (`1234-5678-9012-3456` with dashes), NOT the raw 16 digits. The pattern `/^\d{4}-\d{4}-\d{4}-\d{4}$/` is the right form to use in `CardFormSchema`. The dashes are stripped in `onSubmit` before sending to the API.

**Warning signs:** Tests that type `"1234567890123456"` (no dashes) and expect the schema to accept it — they will fail if the pattern requires dashes.

### Pitfall 2: Schema pattern not triggering for partially-filled inputs blocked by the formatter

**What goes wrong:** Because `formatCardNumber` truncates at 16 raw digits, the user can never type more than 16 digits. However, a user CAN submit with fewer than 16 digits (e.g., type only 8 digits). The schema pattern needs to catch this on submit.

**How to avoid:** The pattern `/^\d{4}-\d{4}-\d{4}-\d{4}$/` requires exactly the full formatted string. A partial entry like `"1234-5678"` will not match, producing the error message.

**Warning signs:** Test scenario where user types fewer than 16 digits and submits — if no error appears, the pattern is wrong.

### Pitfall 3: Strapi restart required after schema.json change

**What goes wrong:** Developer edits `schema.json` but does not restart Strapi dev server. Old schema (with regex) remains active, causing validation failures.

**How to avoid:** Restart `npm run develop` in `bank-dash-server/` after editing `schema.json`. Strapi 5 loads content-type definitions at startup.

**Warning signs:** Card creation POST fails with a Strapi `ValidationError` mentioning the `number` field after the schema edit.

### Pitfall 4: Existing test "formats card number with dashes as user types" may conflict with new schema pattern

**What goes wrong:** `AddCardModal.test.tsx` line 83-91 types `"1234567890123456"` and expects value `"1234-5678-9012-3456"`. This test verifies the formatter, not the validator. No conflict here. However, if new tests check that submitting a partial number shows an error, they must fire `handleSubmit` (e.g., click "Add Card") not just type into the field.

**How to avoid:** Distinguish formatter tests (interact with input field only) from validator tests (fill partial data, attempt submit, check for error message).

---

## Code Examples

### Current CardFormSchema (from types/card.ts lines 44-64)

```typescript
// Source: bank-dash-app/src/types/card.ts
export const CardFormSchema = Schema.Struct({
  isPhysical: Schema.optional(Schema.Boolean),
  isActive: Schema.optional(Schema.Boolean),
  nameOnCard: Schema.String.pipe(
    Schema.minLength(1, { message: () => 'Name on card is required' }),
  ),
  cardNumber: Schema.String.pipe(
    Schema.minLength(1, { message: () => 'Card number is required' }),
    Schema.maxLength(19, { message: () => 'The maximum number is 16 digits' }),
  ),
  // ...
});
```

### Target CardFormSchema change (cardNumber field only)

```typescript
cardNumber: Schema.String.pipe(
  Schema.minLength(1, { message: () => 'Card number is required' }),
  Schema.maxLength(19, { message: () => 'The maximum number is 16 digits' }),
  Schema.pattern(/^\d{4}-\d{4}-\d{4}-\d{4}$/, {
    message: () => 'Card number must be 16 digits',
  }),
),
```

### Target Strapi schema.json change (number attribute only)

```json
"number": {
  "type": "string",
  "required": true
}
```

### Test pattern for schema validation error (new test to add)

```typescript
// Tests that incomplete card number shows validation error on submit
it('shows validation error when card number is incomplete', async () => {
  const user = userEvent.setup();
  render(<AddCardModal {...defaultProps} />);

  // Type only 8 digits — formatter produces "1234-5678", not a full card number
  await user.type(screen.getByPlaceholderText('**** **** **** ****'), '12345678');
  await user.type(screen.getByPlaceholderText('My Cards'), 'John Doe');
  // Submit the form
  await user.click(screen.getByRole('button', { name: 'Add Card' }));

  expect(await screen.findByText('Card number must be 16 digits')).toBeInTheDocument();
});
```

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| Strapi regex as safety net | Client-only validation | Server is thinner; client must be complete |
| `maxLength(19)` only in schema | `maxLength(19)` + `Schema.pattern` | Schema now enforces the full format rule, not just length |

**Deprecated/outdated:**
- `"regex": "^[0-9]{16}$"` in Strapi card schema: Remove entirely per SERVER-01.

---

## Open Questions

1. **Does the `CardFormSchema` pattern need a distinct "empty" vs "incomplete" message?**
   - What we know: `minLength(1)` catches empty; `Schema.pattern` catches partial completion.
   - What's unclear: Whether UX calls for distinct messages ("Card number is required" vs "Card number must be 16 digits") or a single message.
   - Recommendation: Use distinct messages as shown above — they are already differentiated in the existing schema and this is clearer for the user.

2. **Does `react-hook-form` `mode` need to change to show real-time (on-change) errors?**
   - What we know: Default RHF mode is `onSubmit` — errors appear after first submit attempt, then re-validate on change. The `AddCardModal` does not set a `mode` option, so it uses the default.
   - What's unclear: Whether the requirements call for errors to appear _before_ the user attempts submit (real-time) vs on submit.
   - Recommendation: CLIENT-03 says "real-time or on submit" — the default `onSubmit` mode satisfies this. No mode change needed unless explicitly requested.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Jest (via `next/jest`) |
| Config file | `bank-dash-app/jest.config.ts` |
| Quick run command | `cd bank-dash-app && npx jest src/components/AddCardModal/AddCardModal.test.tsx --no-coverage` |
| Full suite command | `cd bank-dash-app && npm run test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CLIENT-01 | Submitting incomplete card number shows inline error | unit | `npx jest src/components/AddCardModal/AddCardModal.test.tsx -t "shows validation error when card number is incomplete" --no-coverage` | ❌ Wave 0 |
| CLIENT-02 | Non-digit characters are stripped from card number input | unit | `npx jest src/components/AddCardModal/AddCardModal.test.tsx -t "formats card number" --no-coverage` | ✅ existing test covers this |
| CLIENT-03 | Error message appears without server call | unit | Same as CLIENT-01 test — `addCard` mock must not be called | ❌ Wave 0 (assert mockAddCard not called) |
| SERVER-01 | Strapi schema.json has no regex on number field | manual | Inspect `bank-dash-server/src/api/card/content-types/card/schema.json` | N/A — file edit |
| SERVER-02 | Card creation succeeds end-to-end after schema change | integration | `npx jest src/services/test/cards.test.ts --no-coverage` | ✅ existing `addCard` service test |

### Sampling Rate

- **Per task commit:** `cd bank-dash-app && npx jest src/components/AddCardModal/AddCardModal.test.tsx --no-coverage`
- **Per wave merge:** `cd bank-dash-app && npm run test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] Add test case to `bank-dash-app/src/components/AddCardModal/AddCardModal.test.tsx`: "shows validation error when card number is incomplete" — covers CLIENT-01 and CLIENT-03 (verify `mockAddCard` is not called)

*(No new test files needed — gaps are new test cases in the existing `AddCardModal.test.tsx` file)*

---

## Sources

### Primary (HIGH confidence)
- Direct file reads — `bank-dash-app/src/types/card.ts`, `AddCardModal.tsx`, `schema.json`, `constants/regex.ts` — authoritative source code
- Direct file reads — `AddCardModal.test.tsx`, `cards.test.ts` — existing test coverage confirmed
- Phase 1 audit — `VALIDATION-AUDIT.md` — all validation locations documented and verified

### Secondary (MEDIUM confidence)
- Effect-TS `Schema.pattern` API — usage pattern confirmed by existing code in `card.ts` lines 24-27 and 60

### Tertiary (LOW confidence)
- None — all claims derived from source code reads or are mechanical JSON edits.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries already in use, confirmed from source
- Architecture patterns: HIGH — derived directly from existing code; changes are minimal and localized
- Pitfalls: HIGH — derived from reading the actual code paths that will be modified

**Research date:** 2026-03-20
**Valid until:** Stable — no fast-moving dependencies involved. Valid as long as Effect-TS Schema API and Strapi 5 content-type format are unchanged.
