---
phase: 2
slug: implement
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-20
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Jest (via `next/jest`) |
| **Config file** | `bank-dash-app/jest.config.ts` |
| **Quick run command** | `cd bank-dash-app && npx jest src/components/AddCardModal/AddCardModal.test.tsx --no-coverage` |
| **Full suite command** | `cd bank-dash-app && npm run test` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `cd bank-dash-app && npx jest src/components/AddCardModal/AddCardModal.test.tsx --no-coverage`
- **After every plan wave:** Run `cd bank-dash-app && npm run test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 2-01-01 | 01 | 0 | CLIENT-01, CLIENT-03 | unit | `cd bank-dash-app && npx jest src/components/AddCardModal/AddCardModal.test.tsx -t "shows validation error when card number is incomplete" --no-coverage` | ❌ W0 | ⬜ pending |
| 2-01-02 | 01 | 1 | CLIENT-01, CLIENT-03 | unit | `cd bank-dash-app && npx jest src/components/AddCardModal/AddCardModal.test.tsx --no-coverage` | ✅ existing | ⬜ pending |
| 2-01-03 | 01 | 1 | CLIENT-02 | unit | `cd bank-dash-app && npx jest src/components/AddCardModal/AddCardModal.test.tsx -t "formats card number" --no-coverage` | ✅ existing | ⬜ pending |
| 2-02-01 | 02 | 1 | SERVER-01 | manual | Inspect `bank-dash-server/src/api/card/content-types/card/schema.json` | N/A | ⬜ pending |
| 2-02-02 | 02 | 1 | SERVER-02 | unit | `cd bank-dash-app && npx jest src/services/cards.test.ts --no-coverage` | ✅ existing | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `bank-dash-app/src/components/AddCardModal/AddCardModal.test.tsx` — add test case "shows validation error when card number is incomplete" covering CLIENT-01 and CLIENT-03 (assert `mockAddCard` is NOT called)

*No new test files needed — gap is a new test case in the existing file.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Strapi schema.json has no `regex` on `number` field | SERVER-01 | File content inspection, not a runtime behavior | Open `bank-dash-server/src/api/card/content-types/card/schema.json` and confirm `"number"` attribute has no `"regex"` key |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
