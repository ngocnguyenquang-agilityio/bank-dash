# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — Card Validation

**Shipped:** 2026-03-20
**Phases:** 2 | **Plans:** 3 | **Sessions:** 1

### What Was Built
- Complete audit document (`VALIDATION-AUDIT.md`) mapping all 5 card number validation locations with data-flow trace
- `Schema.pattern` validator on `CardFormSchema.cardNumber` enforcing 16-digit dashed format — inline error without server request
- Strapi card schema cleaned of duplicate regex — server accepts any non-empty string, client owns format rules

### What Worked
- Audit-first approach (Phase 1) gave Phase 2 precise targets — zero guesswork about what to change
- TDD in Phase 2 (RED test first) proved client-side behavior before implementation — test `expect(mockAddCard).not.toHaveBeenCalled()` is an elegant client-side proof
- Isolating schema change to `types/card.ts` rather than touching `AddCardModal.tsx` (343 lines) kept complexity flat
- All 248 tests remained green through both phases — no regressions

### What Was Inefficient
- Milestone had no audit (`/gsd:audit-milestone` skipped) — for a small 2-phase milestone this was fine, but larger milestones should audit first
- `gsd-tools milestone complete` couldn't auto-extract accomplishments from SUMMARY.md files (tasks=0, accomplishments=[]) — manually filled

### Patterns Established
- `CardFormSchema` validators follow `minLength → maxLength → pattern` pipeline order
- Client-side validation tests assert `mockAddCard` not called to confirm no server round-trip
- Strapi schema changes: edit `schema.json` directly; field remains functional with only `type` + `required`

### Key Lessons
1. Audit phases pay off immediately — VALIDATION-AUDIT.md made Phase 2 planning trivial by naming exact files and line numbers
2. Validating the *formatted* value (dashed string) rather than raw digits is the right approach when `formatCardNumber` runs first — always check what value RHF actually stores
3. Belt-and-suspenders (`maxLength` + `Schema.pattern`) is fine when each guard has a distinct failure mode

### Cost Observations
- Model mix: ~100% sonnet (balanced profile)
- Sessions: 1
- Notable: Both phases completed in under 10 minutes total; small, targeted scope enabled fast execution

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v1.0 | 1 | 2 | Initial milestone — established audit-first pattern |

### Cumulative Quality

| Milestone | Tests | Coverage | Zero-Dep Additions |
|-----------|-------|----------|-------------------|
| v1.0 | 248 | — | 0 |

### Top Lessons (Verified Across Milestones)

1. Audit-first phases remove implementation ambiguity and pay for themselves in Phase 2 planning speed
2. Isolate validation changes to schema/type files — avoid touching large UI components unnecessarily
