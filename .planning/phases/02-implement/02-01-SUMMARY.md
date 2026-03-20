---
phase: 02-implement
plan: 01
subsystem: ui
tags: [effect-ts, react-hook-form, zod, validation, testing]

# Dependency graph
requires:
  - phase: 01-audit
    provides: VALIDATION-AUDIT.md identifying missing Schema.pattern on cardNumber field
provides:
  - CardFormSchema.cardNumber with /^\d{4}-\d{4}-\d{4}-\d{4}$/ pattern validator
  - Test proving inline validation error appears without server round-trip
affects: [AddCardModal, CardFormSchema consumers, 02-implement remaining plans]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Effect-TS Schema.pattern piped after minLength/maxLength for regex-enforced format validation"
    - "TDD RED-GREEN: write failing test first, then add minimal schema change to pass"

key-files:
  created: []
  modified:
    - bank-dash-app/src/types/card.ts
    - bank-dash-app/src/components/AddCardModal/AddCardModal.test.tsx

key-decisions:
  - "Used /^\\d{4}-\\d{4}-\\d{4}-\\d{4}$/ pattern to validate the formatted (dashed) card number value stored by react-hook-form, not the raw digit string"
  - "Kept maxLength(19) alongside pattern — belt-and-suspenders approach, maxLength remains as early-exit guard"

patterns-established:
  - "Pattern 1: CardFormSchema validators follow minLength -> maxLength -> pattern pipeline order"
  - "Pattern 2: Client-side validation test asserts mockAddCard not called to confirm no server round-trip"

requirements-completed: [CLIENT-01, CLIENT-02, CLIENT-03]

# Metrics
duration: 2min
completed: 2026-03-20
---

# Phase 2 Plan 01: Add Card Number Pattern Validation Summary

**Schema.pattern validator on CardFormSchema.cardNumber enforcing /^\d{4}-\d{4}-\d{4}-\d{4}$/ — incomplete entries now show inline error without any server request**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-20T03:38:09Z
- **Completed:** 2026-03-20T03:40:03Z
- **Tasks:** 2 (TDD: 1 RED + 1 GREEN)
- **Files modified:** 2

## Accomplishments
- Added `Schema.pattern(/^\d{4}-\d{4}-\d{4}-\d{4}$/)` to `CardFormSchema.cardNumber` as a third pipe stage
- Proves via test that submitting 8 digits (formatted as "1234-5678") shows "Card number must be 16 digits" inline error
- Proves via `expect(mockAddCard).not.toHaveBeenCalled()` that validation is 100% client-side
- Full suite 248/248 tests passing after change

## Task Commits

Each task was committed atomically:

1. **Task 1: Write failing test for incomplete card number validation error** - `df9221a` (test)
2. **Task 2: Add Schema.pattern validator to CardFormSchema and turn tests green** - `1d5695c` (feat)

**Plan metadata:** (created in final commit)

_Note: TDD tasks have two commits — test (RED) then feat (GREEN)_

## Files Created/Modified
- `bank-dash-app/src/types/card.ts` - Added `Schema.pattern(/^\d{4}-\d{4}-\d{4}-\d{4}$/)` to `CardFormSchema.cardNumber`
- `bank-dash-app/src/components/AddCardModal/AddCardModal.test.tsx` - Added two test cases for incomplete and complete card number validation

## Decisions Made
- Pattern validates the formatted value ("1234-5678-9012-3456") because `formatCardNumber` in AddCardModal.tsx writes the dashed string into the react-hook-form field — the schema sees the formatted string, not the raw digits.
- `maxLength(19)` kept alongside the new `pattern` validator as an early-exit guard (belt-and-suspenders).

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- CLIENT-01, CLIENT-02, CLIENT-03 satisfied: 16-digit enforcement, non-numeric stripping, and inline feedback without server round-trip all work
- CardFormSchema is ready for any additional validators in subsequent plans
- No blockers for remaining 02-implement plans

---
*Phase: 02-implement*
*Completed: 2026-03-20*

## Self-Check: PASSED

- FOUND: bank-dash-app/src/types/card.ts
- FOUND: bank-dash-app/src/components/AddCardModal/AddCardModal.test.tsx
- FOUND: .planning/phases/02-implement/02-01-SUMMARY.md
- FOUND: commit df9221a (test - TDD RED)
- FOUND: commit 1d5695c (feat - TDD GREEN)
