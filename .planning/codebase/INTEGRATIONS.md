# External Integrations

**Analysis Date:** 2026-03-18

## APIs & External Services

**Clerk Authentication:**
- Service: Clerk (https://clerk.com)
- What it's used for: User authentication, session management, user data storage
- SDK/Client: @clerk/nextjs 6.36.10
- Auth: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY, CLERK_WEBHOOK_SIGNING_SECRET
- Implementation: `<ClerkProvider>` wraps root layout (`src/app/layout.tsx`), auth enforced via `getAuth()` in layout redirects
- Webhook: POST `src/app/api/webhooks/route.ts` listens for `user.created` event

## Data Storage

**Primary Database:**
- Type/Provider: SQLite (default) or MySQL/PostgreSQL configurable
- Location: `bank-dash-server/` (Strapi backend)
- Connection: Via `DATABASE_CLIENT`, `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`
- Config: `bank-dash-server/config/database.ts`
- Client: Knex.js (via Strapi)
- Driver: better-sqlite3 12.4.1 (for SQLite), mysql2 (for MySQL), pg (for PostgreSQL)

**Content Types (Strapi):**
- `card` - Bank card records
- `member` - User membership records (created via Clerk webhook)
- `transaction` - Financial transaction records
- `transfer` - Money transfer operations (uses Knex atomic transactions)

**File Storage:**
- Type: Local filesystem uploads (Strapi default)
- Location: `bank-dash-server/public/uploads/`
- Configuration: Strapi file upload plugin
- Custom middleware: `upload-eperm-handler.ts` (Windows EPERM error fix)
- Frontend image access: Next.js Image component with remote patterns configured for localhost:1337 and HTTPS domains

**Caching:**
- Type: Next.js built-in Data Cache + On-Demand ISR (Incremental Static Regeneration)
- Strategy: Cache tags + revalidation times
- Tags: `CACHE_TAGS.CARDS`, `CACHE_TAGS.TRANSACTIONS`, `CACHE_TAGS.MEMBERS`
- Revalidation times:
  - Cards: 5 minutes
  - Transactions: 1 minute
  - Members: 10 minutes
- Implementation: Via `next` option in ApiClient requests (`src/services/api.ts`)
- Invalidation: Manual revalidation via `revalidateTag()` in server actions

## Authentication & Identity

**Auth Provider:**
- Service: Clerk
- Implementation: OAuth/JWT-based authentication
- Session management: Clerk sessions stored in cookies
- User data flow:
  1. User signs up via Clerk UI (`/sign-up`)
  2. Clerk webhook triggers `POST /api/webhooks` with `user.created` event
  3. Webhook handler (`src/app/api/webhooks/route.ts`) creates Strapi member record with Clerk user ID
  4. Member linked by `clerkId` field in Strapi database
- Protected routes: Implemented via layout-level `getAuth()` checks in `src/app/(home)/layout.tsx`
- Public routes: `/sign-in`, `/sign-up`, `/api/webhooks`

## API Communication

**Frontend → Backend:**
- Base URL: `NEXT_PUBLIC_API_URL` (default: http://localhost:1337/api)
- Client: Custom `ApiClient` singleton (`src/services/api.ts`)
- Method: Native `fetch` API wrapped in Effect-ts
- Endpoints used:
  - `GET /cards?populate=*&filters[member][clerkId][$eq]={userClerkId}` - Get user cards
  - `GET /transactions?populate=*&filters[member][clerkId][$eq]={userClerkId}` - Get transactions
  - `GET /members/{id}` - Get member profile
  - `POST /members` - Create new member (via webhook)
  - `POST /transfers` - Create transfer (server action)
  - `POST /cards` - Create card

**Error Handling:**
- ApiError: HTTP errors with status codes
- NetworkError: Network connectivity failures
- ApiRequestError: High-level error wrapper with message + details
- Implementation: `src/services/api.effect.ts` (requestEffect), `src/lib/errors/handleApiError.ts`

## Monitoring & Observability

**Error Tracking:**
- Type: Console logging (native implementation)
- Implementation: Console.error() in Effect pipelines and error handlers
- No external error tracking service (Sentry, LogRocket, etc.)

**Logs:**
- Approach: Browser console logs (development) and server console logs (both frontend and backend)
- Implementation:
  - Frontend: `console.log`, `console.error` in components and services
  - Backend: Strapi built-in logging
- Tracing: OpenTelemetry spans via Effect's `withSpan()` operator
  - Implementation: `src/lib/effect/operators.ts` provides `withSpan(name, attributes)` wrapper
  - Example: `Effect.withSpan('getCardsEffect', { attributes: { userClerkId } })`
- DevTools: Effect DevTools WebSocket at ws://localhost:34437 when `EFFECT_DEVTOOLS=true` and `NODE_ENV=development`

## CI/CD & Deployment

**Hosting:**
- Frontend: No external hosting configured (development mode only)
- Backend: No external hosting configured (development mode only)
- Recommended: Vercel (frontend), Heroku/Railway/Render (backend)

**CI Pipeline:**
- Type: None detected (no GitHub Actions, GitLab CI, or CircleCI configured)
- Pre-commit hooks: Husky + commitlint
  - Enforces conventional commits (feat:, fix:, chore:, etc.)
  - Runs ESLint + Prettier on staged files via lint-staged

## Webhooks & Callbacks

**Incoming Webhooks:**
- Clerk User Created Webhook
  - Endpoint: `POST /api/webhooks/route.ts`
  - Trigger: `user.created` event from Clerk
  - Payload: WebhookEvent with user data (id, email_addresses, first_name, last_name, username)
  - Handler: Creates Strapi member record linked to clerkId
  - Signature verification: Clerk webhook signing secret validation (via @clerk/nextjs)

**Outgoing Webhooks:**
- Type: None detected (frontend doesn't make outbound webhook calls)

## Service Configuration

**Strapi Plugins Enabled:**
- @strapi/plugin-users-permissions - User authentication and role management
- @strapi/plugin-cloud - Cloud deployment and hosting features
- strapi-health-plugin - Health check monitoring
- Custom plugins in `bank-dash-server/config/plugins.ts`

**Custom Middlewares (Strapi):**
- cache-control.ts - HTTP cache control headers
- upload-eperm-handler.ts - Windows EPERM error handling for file uploads

**API Authentication:**
- Strapi API tokens: Generated in Strapi admin panel
- JWT: Admin JWT secret in `ADMIN_JWT_SECRET`
- Public routes: Strapi content type permissions allow public read access (default)

## Data Exchange Formats

**API Response Format:**
- JSON (application/json)
- Pagination: `pagination[page]`, `pagination[pageSize]` query params
- Population: `populate=*` for eager loading related records
- Filtering: `filters[field][$eq]=value` for query conditions
- Sorting: `sort=field:desc` or `sort=field:asc`

**Form Validation:**
- Frontend: react-hook-form + Zod (for forms)
- Server: Effect Schema validation (for API responses)
- No form submission webhooks

## Rate Limiting

**Rate Limits:**
- Type: Not detected (no rate limiting configured)
- Recommended: Configure Strapi rate limiting middleware for production

## Third-Party Integrations

**Chart Library (Recharts):**
- Used in: `BalanceHistory.tsx`, `WeeklyActivity.tsx`
- Purpose: Display financial data visualizations (area charts, bar charts)
- No external API calls (client-side only)

**Icon Library (Lucide React):**
- Used throughout components for UI icons
- No external API calls (SVG icons bundled)

**Theme Management (next-themes):**
- Used in: `src/components/ui/sonner.tsx`
- Purpose: Dark/light mode theme switching
- Storage: localStorage (next-themes default)
- No external API calls

---

*Integration audit: 2026-03-18*
