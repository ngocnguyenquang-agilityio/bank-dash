# External Integrations

**Analysis Date:** 2026-03-20

## APIs & External Services

**Strapi Headless CMS:**
- Purpose: Serves as backend API for all data (cards, transactions, members, transfers)
- Endpoint: `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:1337/api`)
- Client: Custom `ApiClient` in `src/services/api.ts` using native `fetch` API
- Protocol: REST JSON over HTTP

**Clerk Authentication:**
- Service: Clerk.dev identity and access management
- Purpose: User signup, sign-in, session management, user profiles
- SDK: @clerk/nextjs 6.36.10
- Configuration:
  - Public key: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - Secret key: `CLERK_SECRET_KEY`
  - Webhook signing: `CLERK_WEBHOOK_SIGNING_SECRET`
- Usage locations:
  - Layout: `src/app/layout.tsx` (ClerkProvider wrapper)
  - Auth hooks: `src/lib/auth.ts` (getAuth() caching)
  - Sign-in page: `src/components/auth/SignInPage/SignInPageWrapper.tsx`
  - Sign-up page: `src/components/auth/SignUpPage/SignUpPageWrapper.tsx`
  - User profile: `src/components/AvatarProfile/AvatarProfile.tsx` (useClerk hook)

## Data Storage

**Databases:**
- SQLite (development default)
  - Connection: `DATABASE_FILENAME=.tmp/data.db`
  - Driver: better-sqlite3 12.4.1
  - File: `bank-dash-server/.tmp/data.db`
- PostgreSQL (production option)
  - Connection: `DATABASE_URL` or `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`
  - Pool: min 2, max 10 connections
  - SSL support configurable via `DATABASE_SSL*` env vars
- MySQL (production option)
  - Connection: `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`
  - Pool: min 2, max 10 connections
  - SSL support configurable

**ORM/Query Layer:**
- Strapi's built-in ORM (Bookshelf-based query builder)
- No external ORM library (managed by Strapi internally)

**File Storage:**
- Local filesystem only
  - Upload directory: Strapi default uploads via `/uploads/**` paths
  - Next.js image remotePatterns configured for:
    - Local: `http://localhost:1337/uploads/**` and `http://127.0.0.1:1337/uploads/**`
    - Remote: HTTPS any domain via `https://**`
  - Windows EPERM fix: Async cleanup handler in `bank-dash-server/src/index.ts`

**Caching:**
- None (no Redis, Memcached, etc.)
- Next.js App Router stale-time: 180s for dynamic routes (experimental)

## Authentication & Identity

**Auth Provider:**
- Clerk.dev (third-party SaaS)

**Implementation Approach:**
- Frontend: Clerk UI components (SignIn, SignUp) via `@clerk/nextjs`
- Backend: Webhook-based user sync
  - Webhook endpoint: `POST /api/webhooks` in `src/app/api/webhooks/route.ts`
  - Trigger: `user.created` event from Clerk
  - Action: Creates corresponding member record in Strapi
  - Data sync: Clerk user ID → `clerkId` field in members collection

**Session Management:**
- Handled by Clerk (JWT tokens in cookies)
- Deduplication: `getAuth()` cached per request via React's `cache()` in `src/lib/auth.ts`

**User Data Linkage:**
- Clerk user ID (`id`) stored in `members.clerkId` field
- Used to associate Clerk sessions with bank member records in Strapi

## Monitoring & Observability

**Error Tracking:**
- None detected (no Sentry, LogRocket, etc.)

**Logs:**
- Console output (console.log, console.warn, console.error)
- Error logging in webhook handler: `bank-dash-app/src/app/api/webhooks/route.ts`
- Strapi logs to stdout by default
- Windows file cleanup warnings: Logged in `bank-dash-server/src/index.ts`

**Debugging:**
- Effect-TS DevTools support (optional via `EFFECT_DEVTOOLS=true`)
  - WebSocket connection to `EFFECT_DEVTOOLS_URL` (default: `ws://localhost:34437`)
  - Enabled only in development mode

## CI/CD & Deployment

**Hosting:**
- Not specified in codebase (flexible deployment)
- Next.js frontend: Suitable for Vercel, Docker, or Node.js hosting
- Strapi backend: Requires Node.js 20+ host (Docker, Railway, custom VPS, etc.)

**CI Pipeline:**
- None detected (no GitHub Actions, GitLab CI, Jenkins config)

**Build & Deploy Scripts:**
- Frontend: `npm run build` (Next.js production build)
- Backend: `npm run build` (Strapi admin build)
- Start commands in scripts section of respective `package.json` files

## Environment Configuration

**Required env vars (Frontend):**
- `NEXT_PUBLIC_API_URL` - Strapi API endpoint (e.g., `http://localhost:1337/api`)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret (backend only)
- `CLERK_WEBHOOK_SIGNING_SECRET` - Webhook verification secret
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL` - Redirect URL (e.g., `/sign-in`)
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL` - Redirect URL (e.g., `/sign-up`)
- `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` - Fallback redirect
- `NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL` - Force redirect (e.g., `/dashboard`)

**Required env vars (Backend/Strapi):**
- `HOST` - Server bind address (default: `0.0.0.0`)
- `PORT` - Server port (default: `1337`)
- `APP_KEYS` - Comma-separated CSRF token generation keys
- `API_TOKEN_SALT` - API token salt
- `ADMIN_JWT_SECRET` - Admin panel JWT secret
- `TRANSFER_TOKEN_SALT` - Transfer operation token salt
- `JWT_SECRET` - General JWT secret
- `ENCRYPTION_KEY` - Data encryption key
- `DATABASE_CLIENT` - Database driver (default: `sqlite`)
- `DATABASE_FILENAME` - SQLite file path (default: `.tmp/data.db`)
- Database credentials (if using postgres/mysql): `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`

**Secrets Location:**
- `.env` and `.env.local` files (git-ignored)
- Secrets should be managed via environment variables in CI/CD systems
- No secrets manager integration detected (Vault, AWS Secrets Manager, etc.)

## Webhooks & Callbacks

**Incoming Webhooks:**
- Clerk webhook: `POST /api/webhooks` (`bank-dash-app/src/app/api/webhooks/route.ts`)
  - Event: `user.created` from Clerk
  - Signature verification: Via `CLERK_WEBHOOK_SIGNING_SECRET`
  - Payload handling: Effect-TS based with Zod schema validation
  - Action: POST to Strapi `POST /api/members` to create member record

**Outgoing Webhooks:**
- None detected (no outgoing third-party integrations)

## API Client Architecture

**Frontend HTTP Layer:**
- Location: `src/services/api.ts` - ApiClient singleton class
- Methods: `get()`, `post()`, `postFormData()`, `put()`, `delete()`
- Error handling: Effect-TS typed errors (`ApiError`, `NetworkError`)
- Timeout support: AbortController-based via `withAbortController()` operator
- Request composition: Base URL + path-based routing
- Deduplication: Singleton ApiClient pattern

**Effect-TS Integration:**
- Location: `src/lib/effect/runtime.ts` - Effect runtime setup
- DevTools: Optional WebSocket-based debugging
- Operations: `src/services/*.effect.ts` files expose Effect operations for React components
- Error handling: Discriminated union types for API/Network errors

**Service Layer Pattern:**
- `*.ts` - Raw fetch/network operations via ApiClient
- `*.effect.ts` - Reusable Effect operations combining multiple network calls
- Example: `src/services/cards.ts` (raw API calls) + `src/services/cards.effect.ts` (composed operations)

---

*Integration audit: 2026-03-20*
