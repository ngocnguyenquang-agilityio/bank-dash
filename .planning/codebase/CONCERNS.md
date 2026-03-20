# Codebase Concerns

**Analysis Date:** 2026-03-20

## Tech Debt

**Large Components with Complex Logic:**
- Issue: Multiple components exceed 300+ lines without clear separation of concerns
- Files: `src/components/AddCardModal/AddCardModal.tsx` (343 lines), `src/components/SettingPageContent/SettingPageContent.tsx` (431 lines), `src/components/QuickTransfer/QuickTransfer.tsx` (271 lines)
- Impact: Difficult to test, reuse, and maintain; increases cognitive load; harder to debug
- Fix approach: Extract form logic into custom hooks, break down into smaller focused sub-components, consider container/presenter pattern

**Incomplete Type Safety with Schema.Unknown:**
- Issue: Member field in card schema uses `Schema.Unknown` instead of proper type definition
- Files: `src/types/card.ts` (line 41)
- Impact: Loss of type safety for related data; potential runtime errors; harder to trace member relationships
- Fix approach: Define a proper MemberSchema with all required fields and use it explicitly

**No Tests for Custom Hooks:**
- Issue: Only 1 test file for 2 hooks (`useUnsavedChanges.ts` has no tests)
- Files: `src/hooks/useUnsavedChanges.ts`, `src/hooks/` directory overall
- Impact: Hook behavior changes could break form UX without detection; state management bugs won't be caught
- Fix approach: Add unit tests for all hooks in `src/hooks/*.test.ts`

**Pages Excluded from Test Coverage:**
- Issue: Jest config explicitly excludes all app directory routes (`!src/app/**`)
- Files: `jest.config.ts` (line 23)
- Impact: No coverage reporting for page components (layouts, dashboard, cards, transactions pages); potential UI regressions
- Fix approach: Either add page component tests or clarify why pages are intentionally untested; document coverage gaps

**Server Effect Runtime Error Handling:**
- Issue: DevTools initialization catches all errors silently without logging details
- Files: `src/lib/effect/runtime.ts` (lines 14-28)
- Impact: DevTools failures could mask configuration issues; hard to debug in development
- Fix approach: Log error details when DevTools initialization fails; make errors more specific (network vs config)

## Known Bugs

**Floating Point Arithmetic in Transfers:**
- Symptoms: Potential rounding errors in balance calculations during fund transfers
- Files: `bank-dash-server/src/api/transfer/services/transfer.ts` (lines 50-81), `bank-dash-app/src/services/transfers.ts` (lines 28-30)
- Trigger: Transfers with amounts that don't divide evenly (e.g., $10.33); repeated transfers can accumulate rounding errors
- Workaround: Use integers (cents) for all balance calculations; current code attempts this but needs verification in all paths
- Impact: Over time, small amounts could be lost or gained in ledger; violates banking accuracy requirements

**Webhook Validation Missing Clerk Webhook Secret:**
- Symptoms: Webhook endpoint could accept spoofed requests from unauthorized sources
- Files: `src/app/api/webhooks/route.ts` (lacks signature verification)
- Trigger: Any attacker can POST to `/api/webhooks` with crafted user data to create members
- Workaround: Manually verify Clerk signatures before processing
- Impact: Privilege escalation risk; fake user accounts could be created; security vulnerability

**Type Assertion Without Validation in Webhook:**
- Symptoms: Type cast `as WebhookEvent` on line 79 without schema validation first
- Files: `src/app/api/webhooks/route.ts` (line 79)
- Trigger: Malformed JSON or unexpected webhook structure from Clerk
- Workaround: None; the code proceeds blindly
- Impact: Could cause crashes if Clerk changes webhook format; potential for processing invalid data

## Security Considerations

**Unauthenticated Transfer Endpoint:**
- Risk: Transfer API endpoint configured with `auth: false` - any user can initiate transfers
- Files: `bank-dash-server/src/api/transfer/routes/transfer.ts`
- Current mitigation: Relies on Clerk user ID (`senderClerkId` from request body) - but this is user-controlled and unverified
- Recommendations:
  - Use authenticated middleware; extract actual user ID from JWT token, not request body
  - Validate sender identity matches authenticated user before processing
  - Add rate limiting to prevent transfer flooding
  - Log all transfers with authentication context for audit trail

**Webhook Secret Missing Verification:**
- Risk: Clerk webhook handler doesn't verify webhook signature; accepts all POST requests
- Files: `src/app/api/webhooks/route.ts`
- Current mitigation: None; currently unprotected
- Recommendations:
  - Import and use `svix` (Clerk's webhook library) to validate signatures
  - Verify `CLERK_WEBHOOK_SIGNING_SECRET` from environment before processing
  - Reject unsigned or invalid signatures with 401/403

**Client-Side State for Sensitive Data:**
- Risk: Card numbers and balances exposed in form state and local component memory
- Files: `src/components/AddCardModal/AddCardModal.tsx` (lines 59-68, field values in state)
- Current mitigation: Data stored temporarily during form submission only
- Recommendations:
  - Never store full card numbers; mask all but last 4 digits
  - Don't echo card numbers back to UI after submission
  - Clear sensitive form data on component unmount using useEffect cleanup

## Performance Bottlenecks

**Large Icons Component (740 Lines):**
- Problem: All SVG icons compiled into single 740-line component; entire component imported for single icon usage
- Files: `src/components/Icons/Icons.tsx`
- Cause: Monolithic icon component instead of separate files or icon library; causes bundle bloat
- Improvement path:
  - Use Lucide React (already in dependencies) for common icons
  - Split custom icons into separate `.tsx` files
  - Use dynamic imports for rarely-used icons
  - Consider icon sprite/symbol approach for SVG icons

**No Pagination Limit in Card Queries:**
- Problem: Card list queries could fetch hundreds of cards without constraint
- Files: `src/services/cards.ts` (getCards function has default pageSize=5 but pageable)
- Cause: No maximum limit enforcement; backend could return large datasets
- Improvement path:
  - Enforce max pageSize (e.g., 100 items)
  - Add cursor-based pagination for large datasets
  - Implement infinite scroll with intersection observer rather than loading all at once

**DevTools Socket Connection in Render:**
- Problem: WebSocket connection attempted on every Effect execution during development
- Files: `src/lib/effect/runtime.ts` (lines 5-31)
- Cause: DevTools layer created per-request instead of singleton
- Improvement path:
  - Cache DevTools layer at module level (partially done with `devToolsLayer` variable, but `getDevToolsLayer()` is called each time)
  - Only enable in specific development scenarios, not by default
  - Consider impact on server-side performance

## Fragile Areas

**Form Submission Error Handling:**
- Files: `src/components/AddCardModal/AddCardModal.tsx` (lines 109-135)
- Why fragile: Generic try-catch without specific error discrimination; all errors show "An unexpected error occurred"
- Safe modification: Always use service-level error handling before UI; destructure specific error types from service response
- Test coverage: AddCardModal has tests but doesn't verify all error paths (InvalidFileType, FileSize validation)

**Transfer Service with Database Transaction:**
- Files: `bank-dash-server/src/api/transfer/services/transfer.ts` (entire file)
- Why fragile: Complex multi-step transaction (find cards → verify balance → calculate → update ledger); any intermediate failure could leave partial state
- Safe modification: Never modify transaction logic without adding explicit rollback tests; verify each step's error handling
- Test coverage: No tests; this critical business logic is untested in Strapi backend

**Webhook User Creation:**
- Files: `src/app/api/webhooks/route.ts` (lines 30-63)
- Why fragile: Creates user record without idempotency; repeated webhook calls create duplicate members
- Safe modification: Add database constraint (UNIQUE on clerkId) or check existence before creating
- Test coverage: No tests for webhook endpoint; both success and failure paths untested

**Date Formatting Edge Cases:**
- Files: `src/components/AddCardModal/AddCardModal.tsx` (line 262: `format(new Date(field.value), 'PPP')`)
- Why fragile: Doesn't handle invalid date strings; relies on date-fns throwing
- Safe modification: Always validate date strings before passing to format(); use safe parsing pattern
- Test coverage: AddCardModal.test.tsx exists but doesn't test date picker interaction or formatting

## Scaling Limits

**SQLite Database Only:**
- Current capacity: Single file-based database; adequate for small user bases (< 10k users/transactions)
- Limit: Concurrent write contention; no replication; single point of failure
- Scaling path:
  - Document migration path to PostgreSQL/MySQL (Strapi supports both)
  - Add environment variable to switch database clients
  - No changes needed to application code if using Strapi abstraction properly

**No Database Indexing Strategy:**
- Current capacity: Queries work for sample data; will degrade quickly
- Limit: `O(n)` member lookup by `clerk_id` will timeout with 100k+ members
- Scaling path:
  - Add database indices on `members.clerk_id`, `cards.member_id`, `transactions.card_id`
  - Profile query performance with realistic data volumes
  - Consider query optimization (batch operations, materialized views)

**Avatar Upload Stored Locally:**
- Current capacity: Filesystem storage on server; no CDN or distributed storage
- Limit: Disk space grows with each upload; no backup; single point of failure
- Scaling path:
  - Migrate to S3 or cloud storage using Strapi's file upload plugins
  - Implement image resizing/optimization before storage
  - Add CDN for serving static assets

## Dependencies at Risk

**React 19 with Next.js 16 - Minor Version Mismatch:**
- Risk: React 19 (latest) with Next.js 16 (stable); potential edge case incompatibilities with concurrent features
- Impact: New React features (use() hook, async components) may not work as expected; unclear if fully tested by Next.js team
- Migration plan:
  - Monitor Next.js 17+ release for explicit React 19 support
  - Test `use()` hook and async component patterns before using in production
  - Keep up with security patches for both React and Next.js

**Effect-TS Experimental APIs:**
- Risk: `@effect/experimental` in dependencies; APIs marked "experimental" may change or be removed
- Impact: DevTools integration (`DevTools.layerWebSocket`) could break in minor version updates
- Migration plan:
  - Only use stable Effect APIs for production code paths
  - Document which APIs are experimental for future upgrades
  - Have fallback for DevTools if experimental API is removed

**Clerk Authentication Without Version Lock:**
- Risk: `@clerk/nextjs` at `^6.36.10` (floating minor/patch); could auto-update with breaking changes
- Impact: Webhook format, JWT structure, or authentication flow could change unexpectedly
- Migration plan:
  - Pin to specific minor version (`~6.36.10`) in production
  - Set up automated testing for auth flows when dependencies update
  - Subscribe to Clerk changelog for breaking changes

## Missing Critical Features

**No Rate Limiting:**
- Problem: No protection against brute force, API flooding, or transfer spam
- Blocks: Can't safely deploy to production with concurrent users; vulnerable to abuse
- Recommended: Add middleware rate limiting (e.g., `express-rate-limit` on Strapi or Next.js route handlers)

**No Audit Logging:**
- Problem: Can't track who transferred funds to whom and when; no compliance trail
- Blocks: Financial operations should be immutable and traceable; missing for regulations
- Recommended: Log all transfers with user ID, amount, timestamp, result; persist to immutable log store

**No Balance Reconciliation:**
- Problem: No way to detect ledger inconsistencies from floating-point errors or bugs
- Blocks: Long-term financial data integrity; can't validate balances match reality
- Recommended: Implement nightly reconciliation job; sum all transactions and verify against stored balances

**No Error Recovery UI:**
- Problem: Failed operations show generic error; user doesn't know if their money was deducted or not
- Blocks: Users lack confidence in transactions; support burden increases
- Recommended: Track transfer status (pending → completed/failed); show user confirmation page after transfer

## Test Coverage Gaps

**API Error Scenarios:**
- What's not tested: Network timeouts, partial response failures, malformed JSON responses, HTTP 5xx errors
- Files: `src/services/api.ts`, `src/services/api.effect.ts` (error paths)
- Risk: Network failures could crash app instead of showing user-friendly errors
- Priority: High - these are production-likely scenarios

**Component Accessibility:**
- What's not tested: Keyboard navigation, screen reader labels, ARIA attributes in modals
- Files: `src/components/AddCardModal/AddCardModal.tsx`, `src/components/QuickTransfer/QuickTransfer.tsx`
- Risk: Inaccessible UI excludes users with disabilities; potential ADA/WCAG violations
- Priority: Medium - affects user experience for subset of users

**Strapi Backend Integration:**
- What's not tested: All 342 backend test files exist but no fixture of them examined
- Files: `bank-dash-server/src/api/**/*.ts` (controllers, services, routes)
- Risk: Backend regressions not caught; transfer logic bugs (floating point, balance checks) untested
- Priority: Critical - financial operations depend on backend correctness

**Form State Edge Cases:**
- What's not tested: Rapid input changes, validation debouncing, concurrent submissions
- Files: `src/components/AddCardModal/AddCardModal.tsx`, form submission logic (lines 109-135)
- Risk: Race conditions in form submission; unsaved changes modal false positives/negatives
- Priority: Medium - affects core user workflows

**Transfer Transaction Atomicity:**
- What's not tested: Transaction rollback when recipient card not found, database connection failures mid-transfer
- Files: `bank-dash-server/src/api/transfer/services/transfer.ts`
- Risk: Partial transfers (money deducted but not credited) if transaction fails
- Priority: Critical - data corruption risk

**Page-Level Components:**
- What's not tested: Loading states, error boundaries, Suspense fallbacks
- Files: `src/app/(home)/dashboard/page.tsx`, `src/app/(home)/cards/page.tsx`, etc.
- Risk: Loading skeletons could display indefinitely if data fetch fails; no fallback UI
- Priority: Medium - impacts perceived reliability

---

*Concerns audit: 2026-03-20*
