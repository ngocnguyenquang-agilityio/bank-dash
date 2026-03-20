---
phase: 02-implement
plan: "02"
subsystem: api
tags: [strapi, json-schema, validation, card]

# Dependency graph
requires:
  - phase: 02-implement
    provides: "Research confirming regex validator exists in Strapi card schema"
provides:
  - "Strapi card schema with regex removed from number attribute — SERVER-01 satisfied"
  - "Verified full frontend test suite (248 tests) still passes — SERVER-02 satisfied"
affects: [03-qa, integration-testing]

# Tech tracking
tech-stack:
  added: []
  patterns: ["Schema-only server changes require no code changes on the client; client-side validation is the sole enforcement layer"]

key-files:
  created: []
  modified:
    - bank-dash-server/src/api/card/content-types/card/schema.json

key-decisions:
  - "Removed regex from Strapi schema rather than changing it — server should not duplicate client-side format rules"

patterns-established:
  - "Strapi schema changes: edit schema.json directly; no server restart needed for schema reads in tests"

requirements-completed: [SERVER-01, SERVER-02]

# Metrics
duration: 2min
completed: 2026-03-20
---

# Phase 2 Plan 02: Server Schema Cleanup Summary

**Removed `"regex": "^[0-9]{16}$"` from Strapi card schema, eliminating duplicate server-side card number format enforcement while keeping `required: true` and `type: string`**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-03-20T07:41:56Z
- **Completed:** 2026-03-20T07:43:28Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments

- Deleted the `"regex"` key from the `number` attribute in `bank-dash-server/src/api/card/content-types/card/schema.json`
- Confirmed the number attribute still has `"type": "string"` and `"required": true`
- Ran card service tests (10 tests) — all pass
- Ran full frontend test suite (248 tests across 36 suites) — all pass; schema change has zero client-side impact

## Task Commits

Each task was committed atomically:

1. **Task 1: Remove regex validator from Strapi card schema** - `d18fac0` (fix)
2. **Task 2: Verify existing card service tests still pass** - no commit (verification-only task, no files changed)

**Plan metadata:** _(docs commit — see final commit below)_

## Files Created/Modified

- `bank-dash-server/src/api/card/content-types/card/schema.json` — Removed `"regex": "^[0-9]{16}$"` from `number` attribute; field now has only `"type": "string"` and `"required": true`

## Decisions Made

- Removed regex entirely rather than changing it — the client already validates the card number format via Zod before submission. Having the server enforce it separately created a mismatched layer that could reject valid future test data.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- SERVER-01 and SERVER-02 are both satisfied
- The Strapi backend will now accept any non-empty string as a card number, enabling client-side-only format validation
- Full test suite is green; safe to proceed to QA or next implementation phase

---
*Phase: 02-implement*
*Completed: 2026-03-20*

## Self-Check: PASSED

- `bank-dash-server/src/api/card/content-types/card/schema.json` — FOUND
- `.planning/phases/02-implement/02-02-SUMMARY.md` — FOUND
- Commit `d18fac0` — FOUND
