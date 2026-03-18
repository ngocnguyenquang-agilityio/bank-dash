# Codebase Concerns

**Analysis Date:** 2026-03-18

## Tech Debt

**Monolithic Icon Component:**
- Issue: Single file (`src/components/Icons/Icons.tsx`) contains 740 lines with 200+ inline SVG icon definitions hardcoded as object properties
- Files: `bank-dash-app/src/components/Icons/Icons.tsx`
- Impact: Makes the component difficult to maintain, adds bundle weight, poor tree-shaking. Adding/removing icons requires editing a massive file
- Fix approach: Extract icons into a proper icon library or split into separate icon files. Use a solution like `lucide-react` (already in dependencies) for most icons instead of custom SVGs

**Large Component Files:**
- Issue: Multiple feature components exceed recommended size limits
  - `SettingPageContent.tsx` (431 lines) handles form state, validation, file upload, unsaved changes modal
  - `AddCardModal.tsx` (343 lines) handles form logic with multiple field transformations
  - `QuickTransfer.tsx` (274 lines) handles member scrolling, selection state, transfer submission
- Files: `bank-dash-app/src/components/SettingPageContent/SettingPageContent.tsx`, `bank-dash-app/src/components/AddCardModal/AddCardModal.tsx`, `bank-dash-app/src/components/QuickTransfer/QuickTransfer.tsx`
- Impact: Reduced readability, difficult to test individual behaviors, high cognitive load
- Fix approach: Extract complex behaviors into custom hooks (`useFormState`, `useScrollNavigation`). Break visual hierarchy into smaller sub-components

**Webhook Authentication Not Enforced:**
- Issue: Clerk webhook endpoint at `POST /api/webhooks/route.ts` does NOT verify webhook signatures. It casts body to `WebhookEvent` type without signature validation
- Files: `bank-dash-app/src/app/api/webhooks/route.ts` (lines 79)
- Impact: Any user could send arbitrary requests to trigger member creation with spoofed Clerk user data. High security risk
- Fix approach: Implement Clerk webhook signature verification using `@clerk/nextjs` `Webhook` class or manual HMAC-SHA256 verification with `CLERK_WEBHOOK_SIGNING_SECRET`

**Transfer Endpoint Without Auth:**
- Issue: POST `/transfers` endpoint has `auth: false` in route config
- Files: `bank-dash-server/src/api/transfer/routes/transfer.ts` (line 8)
- Impact: Any user can call the transfer API without authentication. Combined with missing input validation on Strapi side, enables unauthorized fund transfers
- Fix approach: Enable auth (`auth: true`). Validate sender exists and matches requesting user. Implement rate limiting

## Security Considerations

**SQL Injection via UUID Truncation:**
- Risk: Backend transfer service creates document IDs via `crypto.randomUUID().replace(/-/g, '').slice(0, 24)`. While not directly SQL injectable, custom UUID generation bypasses Strapi's built-in ID generation safety checks
- Files: `bank-dash-server/src/api/transfer/services/transfer.ts` (lines 104, 144)
- Current mitigation: Using Knex parameterized queries
- Recommendations: Use Strapi's built-in `document_id` generation. If custom IDs needed, validate format before database operations

**Error Messages Expose Internal Details:**
- Risk: Transfer service catches all errors and logs them with `strapi.log.error()` which may expose database structure or configuration
- Files: `bank-dash-server/src/api/transfer/controllers/transfer.ts` (line 23)
- Current mitigation: Generic error returned to client ("Transaction failed")
- Recommendations: Log full error internally, return sanitized error to client. Never log sensitive data like card numbers or amounts

**Missing Input Sanitization on ClerkId:**
- Risk: ClerkId values are passed directly into Knex WHERE clauses without type validation
- Files: `bank-dash-server/src/api/transfer/services/transfer.ts` (lines 37, 63)
- Current mitigation: Strapi's Knex parameterization prevents SQL injection but not format attacks
- Recommendations: Validate ClerkId format matches Clerk's UUID format before database queries

## Performance Bottlenecks

**Integer-Cent Arithmetic Without Rounding Guard:**
- Problem: Transfer calculations use `Math.round(balance * 100)` to handle floating point, but repeated conversions across sender/recipient could introduce cumulative rounding errors
- Files: `bank-dash-server/src/api/transfer/services/transfer.ts` (lines 50-52, 78-81)
- Cause: Financial calculations should use fixed-point decimal arithmetic, not float conversions
- Improvement path: Use `Decimal.js` or similar library for financial precision. Store balances as integers (cents) in database

**Inefficient Card Selection:**
- Problem: Finding sender's active card requires iterating all cards with `senderCards.find()` after database query
- Files: `bank-dash-server/src/api/transfer/services/transfer.ts` (lines 51-52)
- Cause: Database query returns all cards then JS filters by balance. Should filter at SQL level
- Improvement path: Add SQL `HAVING balance >= ?` clause to find suitable card in one query

**Transaction Order Retrieval Per Card:**
- Problem: For each transfer, queries `max(transaction_ord)` separately for sender and recipient cards (lines 87-101)
- Files: `bank-dash-server/src/api/transfer/services/transfer.ts` (lines 87-101)
- Cause: Could batch query both in single statement with GROUP BY
- Improvement path: Single query: `SELECT card_id, MAX(transaction_ord) FROM transactions_card_lnk WHERE card_id IN (?, ?) GROUP BY card_id`

**Cache Revalidation Triggers All Cards:**
- Problem: Every transfer, card update, or member change calls `updateTag(CACHE_TAGS.CARDS)` which invalidates cache for ALL cards, not just the affected card
- Files: `bank-dash-app/src/services/cards.ts` (lines 66, 143, 174), `bank-dash-app/src/services/transfers.ts` (line 47)
- Impact: Frequent full card list revalidation defeats caching benefits for multi-card users
- Improvement path: Use granular cache tags like `CACHE_TAGS.CARD(cardId)` and only invalidate specific cards involved in operations

## Known Bugs

**Date Timestamp Inconsistency (Fixed but Pattern Remains):**
- Bug: Earlier commits show `Date.now()` was used for timestamp fields instead of ISO strings. Fix applied in commit `eaca037`
- Files: `bank-dash-server/src/api/transfer/services/transfer.ts` (lines 83-84 now use ISO string correctly)
- Current state: Fixed but similar issues could exist in other services
- Recommendations: Enforce ISO string timestamps across all services. Add linting rule to prevent `Date.now()` in API responses

**Avatar Upload Windows EPERM Handling:**
- Bug: Windows systems throw EPERM error during file upload due to file locking
- Files: `bank-dash-server/src/middlewares/upload-eperm-handler.ts` (custom middleware)
- Current mitigation: Custom middleware catches and retries
- Workaround notes: Users on Windows may need to retry avatar uploads

## Fragile Areas

**Transfer Transaction Atomicity Assumption:**
- Files: `bank-dash-server/src/api/transfer/services/transfer.ts`
- Why fragile:
  - Entire transfer is inside Knex transaction, but transaction scope depends on proper error handling
  - If any INSERT/UPDATE fails mid-transaction, rollback is implicit but not verified
  - Database connection drops during transaction cause client to see "Transaction failed" with no indication of partial state
- Safe modification:
  - Test transaction rollback explicitly (create card with insufficient balance, verify no transaction records created)
  - Log transaction ID for debugging
  - Wrap in try-catch to verify rollback on network/DB errors
- Test coverage: No explicit transaction rollback tests found

**Floating Point Balance Updates:**
- Files: `bank-dash-app/src/components/QuickTransfer/QuickTransfer.tsx`, `bank-dash-server/src/api/transfer/services/transfer.ts`
- Why fragile:
  - Balances stored/displayed as strings but calculations use floats
  - UI format expects comma-separated (e.g., "1,234.56") but API may return different precision
  - Balance formatting and validation spread across multiple components
- Safe modification:
  - Add validation in service layer to ensure final balance is non-negative
  - Document expected balance precision (2 decimal places)
  - Test with edge cases: 0.01 transfers, large balances > 1M, precision at .001 cents
- Test coverage: `src/services/test/cards.test.ts` exists but balance math not directly tested

**Webhook Member Creation Race Condition:**
- Files: `bank-dash-app/src/app/api/webhooks/route.ts`
- Why fragile:
  - Clerk fires webhook → frontend creates member record → frontend immediately tries to fetch that member
  - If webhook handler slow or fails silently, member may not exist when queries run
  - No retry or deduplication logic if webhook fires twice
- Safe modification:
  - Add webhook signature verification to prevent duplicate processing
  - Implement idempotency key (clerk ID should be unique, add unique constraint)
  - Return 5xx error on member creation failure so Clerk retries
- Test coverage: No webhook handler tests found

**Member Disabled Logic Is Implicit:**
- Files: `bank-dash-app/src/components/QuickTransfer/QuickTransfer.tsx` (lines 45-57)
- Why fragile:
  - Members without active cards are disabled in UI (`disabledMemberIds`), but backend doesn't enforce this
  - Client could still select disabled member and submit transfer
  - Disabled state not cached, recomputed on every render
- Safe modification:
  - Backend: Check recipient has active card when processing transfer
  - Frontend: Memoize `disabledMemberIds` with `useMemo` (already done, line 45)
  - Test: Verify transfer fails if recipient loses active card between UI selection and API call
- Test coverage: `CardsPageContent.test.tsx` and `QuickTransfer` have no tests

## Test Coverage Gaps

**Transfer Service Not Tested:**
- What's not tested: Core business logic of `transfer()` service function including:
  - Balance sufficiency check with floating point values
  - Card selection logic (first active card with sufficient balance)
  - Transaction creation (draft + published rows)
  - Concurrent transfers to same card
- Files: `bank-dash-server/src/api/transfer/services/transfer.ts`
- Risk: Critical financial operation has zero test coverage. Bugs in balance calculations go undetected
- Priority: HIGH - This is the core value transfer logic

**Webhook Handler Not Tested:**
- What's not tested:
  - Signature verification (currently missing)
  - Member creation payload validation
  - Failure modes (network error, duplicate user.created events)
  - Malformed webhook payloads
- Files: `bank-dash-app/src/app/api/webhooks/route.ts`
- Risk: Unauthorized member creation if signature check bypassed
- Priority: HIGH - Security-critical code path

**QuickTransfer Component No Unit Tests:**
- What's not tested:
  - Member selection and filtering
  - Scroll button visibility logic
  - Amount validation before submission
  - Error handling and display
  - Auto-selection of first available member
- Files: `bank-dash-app/src/components/QuickTransfer/QuickTransfer.tsx`
- Risk: Transfer UI bugs affect core user journey
- Priority: HIGH - High-interaction component

**Card Balance Update Logic No Tests:**
- What's not tested:
  - Format string transformations (comma/decimal handling)
  - Balance validation regex
  - Concurrent balance updates
- Files: `bank-dash-app/src/services/cards.ts`, `bank-dash-app/src/components/CardSetting/CardSetting.tsx`
- Risk: Users may enter invalid balances that corrupt data
- Priority: MEDIUM - Data integrity risk

**AddCardModal Validation Tests Incomplete:**
- What's not tested:
  - Card number format validation with 16-digit regex
  - Expiration date validation
  - Balance formatting (comma insertion/removal)
  - Address field optional validation
- Files: `bank-dash-app/src/components/AddCardModal/AddCardModal.tsx`
- Risk: Invalid card data could be submitted
- Priority: MEDIUM

**Effect Operators No Tests:**
- What's not tested:
  - `withTimeout` behavior on slow requests
  - `withNetworkRetry` exponential backoff correctness
  - Abort signal cleanup on scope exit
- Files: `bank-dash-app/src/lib/effect/operators.ts`
- Risk: Timeout/retry logic silently fails in production
- Priority: MEDIUM - Infrastructure code

**SettingPageContent File Upload No Tests:**
- What's not tested:
  - File type validation
  - File size validation
  - Image preview generation
  - Concurrent upload handling
- Files: `bank-dash-app/src/components/SettingPageContent/SettingPageContent.tsx` (lines 112-150)
- Risk: Users upload invalid files or bypass file size limits
- Priority: MEDIUM

---

*Concerns audit: 2026-03-18*
