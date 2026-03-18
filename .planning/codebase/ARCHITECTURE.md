# Architecture

**Analysis Date:** 2026-03-18

## Pattern Overview

**Overall:** Server Component Composition with Effect-TS functional error handling

**Key Characteristics:**
- Server-side data fetching via Next.js App Router (React 19 Server Components)
- Functional effect-based service layer using Effect-TS for composable error handling
- Headless CMS backend (Strapi) with SQLite database
- Client-side auth via Clerk with server-side webhooks
- Cache-first strategy with tag-based revalidation
- Atomic database transactions for financial operations

## Layers

**Presentation Layer:**
- Purpose: Server and client components rendering UI with interactive features
- Location: `src/app/`, `src/components/`
- Contains: Next.js pages (async RSC), page components (Server Components), interactive client components
- Depends on: Service layer, auth utilities, UI primitives
- Used by: Next.js routing system

**Service Layer:**
- Purpose: Business logic and API communication with Effect-based error handling
- Location: `src/services/`
- Contains: Effect definitions (`.effect.ts`), server actions (`.ts`), API client
- Depends on: API client, Effect-TS runtime, Clerk auth
- Used by: Components and route handlers

**Data Access Layer:**
- Purpose: Single point for API communication to Strapi backend
- Location: `src/services/api.ts` (ApiClient singleton)
- Contains: Fetch wrapper with cache tags, HTTP methods (GET, POST, PUT, DELETE)
- Depends on: Effect-TS, fetch API, Next.js cache control
- Used by: Service layer

**Effect Runtime & Operators:**
- Purpose: Composable effect utilities for async operations, retry logic, timeouts, tracing
- Location: `src/lib/effect/` (operators, runtime, http utilities)
- Contains: `withTimeout()`, `withNetworkRetry()`, `withSpan()`, `withAbortController()`, `runServerEffect()`
- Depends on: Effect library, OpenTelemetry for tracing, DevTools (optional)
- Used by: Service layer effects

**Backend (Strapi):**
- Purpose: Content management, data persistence, atomic transfer logic
- Location: `bank-dash-server/src/api/`
- Contains: Content types (card, member, transaction, transfer), controllers, routes, custom services
- Depends on: Knex.js (transaction support), Node.js
- Used by: Frontend API layer

## Data Flow

**User Authentication & Member Creation:**

1. User signs up via Clerk auth UI (`src/app/(auth)/sign-up`)
2. Clerk webhook (POST `/api/webhooks`) triggers on `user.created`
3. Webhook handler parses Clerk user data via Effect Schema validation
4. Effect handler calls `fetch POST /api/members` to Strapi
5. Strapi creates new member record linked to Clerk ID

**Dashboard Load (Cards & Transactions):**

1. User navigates to `/dashboard` (protected route via `src/app/(home)/layout.tsx`)
2. Layout checks auth via `getAuth()` (Clerk cached auth context)
3. Dashboard page component (`src/app/(home)/dashboard/page.tsx`) runs as Server Component
4. Page suspends sections with Suspense boundaries (streaming)
5. Each section fetches data:
   - `<MyCardsSection />` calls `getCardsEffect()` → `runServerEffect()` → `getCards()` server action
   - `<RecentTransactionsSection />` calls similar pattern
   - `<BalanceHistory />` fetches transactions with 1-min revalidation
6. Effects:
   - Define API call via `apiClient.get()` returning `Effect.Effect<T, ApiError | NetworkError>`
   - Wrap with `requestEffect()` to convert API errors to `ApiRequestError`
   - Map success to `{ data, error: null }`
   - Catch all errors to `{ data: null, error: message }`
   - Add OpenTelemetry span for tracing
7. Server action executes effect via `runServerEffect()` and returns result to component
8. Next.js caches response with `tags` and `revalidate` from effect definition
9. Component renders data or error state

**Quick Transfer (Atomic Operation):**

1. User fills transfer form and submits (`src/components/QuickTransfer/`)
2. Form handler calls `transfers.ts` server action with effect definition
3. Server action executes transfer effect:
   - Calls Strapi POST `/api/transfers` endpoint
   - Backend service (`bank-dash-server/src/api/transfer/services/transfer.ts`) runs in DB transaction
   - Transaction validates sender card balance (integer-cent arithmetic)
   - Creates withdrawal transaction for sender, deposit for recipient
   - Updates both card balances atomically
   - Returns success or error
4. Client receives result, updates UI, invalidates cache tags
5. Next.js revalidates cards and transactions on next fetch

**State Management:**

- Server state: Strapi SQLite database, Clerk user data
- Client state: React hooks (form state via `react-hook-form`), URL search params
- Cache state: Next.js fetch cache with tag-based revalidation
- Auth state: Clerk session in Request context, accessed via `getAuth()` (cached per request)

## Key Abstractions

**Effect-Based Service:**
- Purpose: Compose async operations with built-in error handling and tracing
- Examples: `src/services/cards.effect.ts`, `src/services/transactions.effect.ts`
- Pattern: Define effect returning `Effect.Effect<Result, Error>`, wrap with utilities (timeout, retry, span), consume via `runServerEffect()`

**ApiClient Singleton:**
- Purpose: Single instance managing fetch, error handling, cache tags, HTTP methods
- Location: `src/services/api.ts`
- Pattern: Private constructor, static `create()` factory, class methods for HTTP verbs, uses `withAbortController()` for cleanup

**Server Action:**
- Purpose: Secure boundary between client and server, executes effect and returns serializable data
- Examples: `src/services/cards.ts` exports `getCards()`, `addCard()`, etc.
- Pattern: `'use server'` directive, call effect via `runServerEffect()`, return `{ data, error }` tuple

**Schema Validation:**
- Purpose: Runtime type checking with Effect-TS schema (not Zod)
- Location: `src/types/card.ts`, webhook handler in `src/app/api/webhooks/route.ts`
- Pattern: Define `Schema.Struct()`, decode unknown data via `Schema.decodeUnknown()` in Effect

**Server Component Sections:**
- Purpose: Modular async components that fetch and render data with Suspense
- Examples: `src/components/DashboardSections/MyCardsSection.tsx`
- Pattern: Async RSC, calls effect via `runServerEffect()`, renders data or error state

## Entry Points

**Frontend Root:**
- Location: `src/app/layout.tsx`
- Triggers: App startup
- Responsibilities: Wrap app in ClerkProvider, mount Toaster, provide fonts and metadata

**Auth Layout:**
- Location: `src/app/(auth)/layout.tsx`
- Triggers: Navigation to `/sign-in` or `/sign-up`
- Responsibilities: Public route group for unauthenticated users

**Home Layout (Protected):**
- Location: `src/app/(home)/layout.tsx`
- Triggers: Navigation to protected routes
- Responsibilities: Check `getAuth()`, redirect if no userId, render Sidebar and DashboardHeader in grid layout, stream main content

**Dashboard Page:**
- Location: `src/app/(home)/dashboard/page.tsx`
- Triggers: User lands on `/dashboard`
- Responsibilities: Render sections (cards, transactions, activity, transfer) with Suspense boundaries and skeletons

**Webhook Handler:**
- Location: `src/app/api/webhooks/route.ts`
- Triggers: Clerk webhook on user creation
- Responsibilities: Parse Clerk event, validate schema, create Strapi member record

**Strapi API Routes:**
- Location: `bank-dash-server/src/api/{card,member,transaction,transfer}/routes/`
- Triggers: HTTP requests from frontend or external systems
- Responsibilities: Route HTTP requests to controllers/services

## Error Handling

**Strategy:** Layered error typing with Effect-TS custom error types, converted to user-facing messages

**Patterns:**

- **ApiError / NetworkError:** Thrown by `ApiClient.request()` when fetch fails or response.ok is false
- **ApiRequestError:** Wrapper that converts API errors to structured error with field validation support
- **Service Result Tuple:** `{ data: T | null, error: string | null }` pattern for server actions
- **Effect.catchAll():** Catch all errors, map to result tuple, never rethrow
- **WebhookError:** Custom tagged error for webhook handler with MESSAGES and status code
- **Validation Errors:** Effect Schema decoding failures caught and converted to ApiRequestError with field details

Error handling example from `src/services/cards.effect.ts`:
```typescript
getCardsEffect().pipe(
  Effect.map((cards) => ({ cards, error: null })),
  Effect.catchAll((error) =>
    Effect.succeed({
      cards: null,
      error: error.message || CARD_ERRORS.GET_CARDS_FAILED,
    }),
  ),
)
```

## Cross-Cutting Concerns

**Logging:**
- Console logging in error handlers and webhook processing
- OpenTelemetry spans via `Effect.withSpan()` for tracing

**Validation:**
- Client: `react-hook-form` with Zod schemas for UI forms
- Server: Effect Schema for webhook data, API response type inference from Effect definitions
- Database: Strapi field validation

**Authentication:**
- Clerk managed via `@clerk/nextjs` (client and server methods)
- Layout-level auth checks via `getAuth()`
- Webhook signature verification via Clerk SDK
- Server-to-server: No API auth tokens needed (internal Next.js server calls)

---

*Architecture analysis: 2026-03-18*
