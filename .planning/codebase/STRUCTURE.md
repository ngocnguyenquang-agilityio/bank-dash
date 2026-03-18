# Codebase Structure

**Analysis Date:** 2026-03-18

## Directory Layout

```
bank-dash/
├── bank-dash-app/                # Frontend: Next.js 16 + React 19 + Tailwind
│   ├── src/
│   │   ├── app/                  # App Router pages and layouts
│   │   │   ├── (auth)/           # Public auth routes (sign-in, sign-up)
│   │   │   ├── (home)/           # Protected dashboard routes with layout
│   │   │   ├── api/              # Backend API routes (webhooks)
│   │   │   ├── layout.tsx        # Root layout with ClerkProvider
│   │   │   ├── page.tsx          # Redirect to /dashboard or HomePageWrapper
│   │   │   └── globals.css       # Tailwind imports
│   │   ├── components/           # React components (Server and Client)
│   │   │   ├── auth/             # Auth page wrappers (SignInPage, SignUpPage)
│   │   │   ├── DashboardSections/ # Server components for dashboard sections
│   │   │   ├── ui/               # shadcn/ui primitives (button, dialog, select, etc)
│   │   │   └── [others]/         # Feature components (Cards, Transfer, etc)
│   │   ├── services/             # Service layer (Effect definitions, server actions)
│   │   │   ├── api.ts            # ApiClient singleton
│   │   │   ├── api.effect.ts     # requestEffect wrapper
│   │   │   ├── cards.effect.ts   # Card fetch effects
│   │   │   ├── cards.ts          # Card server actions
│   │   │   ├── transfers.ts      # Transfer server actions
│   │   │   └── test/             # Service tests
│   │   ├── lib/                  # Utilities and helpers
│   │   │   ├── auth.ts           # getAuth() cached auth context
│   │   │   ├── effect/           # Effect-TS utilities
│   │   │   │   ├── operators.ts  # withTimeout, withRetry, withSpan, withAbortController
│   │   │   │   ├── runtime.ts    # runServerEffect with DevTools
│   │   │   │   ├── http.ts       # RequestInitExtended type, error formatters
│   │   │   │   └── [*.test.ts]   # Effect utility tests
│   │   │   ├── errors/           # Error handling
│   │   │   └── utils.ts          # Utility functions (cn, maskCardNumber, getApiBaseUrl, etc)
│   │   ├── types/                # TypeScript types and schemas
│   │   │   ├── card.ts           # Card types, CardSchema, CardFormSchema
│   │   │   ├── member.ts         # Member types
│   │   │   └── [others]          # Transaction, Transfer types
│   │   ├── constants/            # Constants
│   │   │   ├── cache.ts          # CACHE_TAGS, REVALIDATE times
│   │   │   ├── error.ts          # Error messages and status codes
│   │   │   └── route.ts          # ROUTES enum
│   │   ├── hooks/                # React hooks
│   │   │   └── useUnsavedChanges.ts # Unsaved changes modal hook
│   │   ├── utils/                # Utility modules
│   │   └── proxy.ts              # Development proxy configuration
│   ├── .storybook/               # Storybook configuration
│   ├── jest.config.js            # Jest test configuration
│   ├── tsconfig.json             # TypeScript configuration with path aliases
│   ├── next.config.js            # Next.js configuration (Turbopack)
│   ├── tailwind.config.ts        # Tailwind CSS configuration
│   └── package.json              # Dependencies, scripts
│
├── bank-dash-server/             # Backend: Strapi 5 headless CMS
│   ├── src/
│   │   ├── api/                  # Content types and routes
│   │   │   ├── card/             # Card content type
│   │   │   │   ├── content-types/ # Schema definition
│   │   │   │   ├── controllers/  # API controllers
│   │   │   │   ├── routes/       # API routes
│   │   │   │   └── services/     # Business logic
│   │   │   ├── member/           # Member content type
│   │   │   ├── transaction/      # Transaction content type
│   │   │   └── transfer/         # Transfer endpoint (custom route + service)
│   │   ├── middlewares/          # Custom Strapi middlewares
│   │   │   └── cache-control.ts  # Cache control headers
│   │   ├── extensions/           # Strapi extensions
│   │   ├── admin/                # Admin panel configuration
│   │   └── index.ts              # Bootstrap and register hooks
│   ├── database.sqlite           # SQLite database file (default)
│   ├── package.json              # Dependencies
│   └── .env                      # Environment configuration (secrets)
│
└── .claude/                      # Project guidance
    └── CLAUDE.md                 # Architecture and command documentation

```

## Directory Purposes

**Frontend Structure:**

**`src/app/`**
- Purpose: Next.js App Router pages and layout hierarchy
- Contains: Page components, route layouts, special files (loading.tsx, error.tsx)
- Key files: `layout.tsx` (root and per-group), page.tsx files for routes

**`src/components/`**
- Purpose: Reusable UI building blocks (React Server Components and Client Components)
- Contains: Feature components, auth pages, dashboard sections, UI primitives
- Key files: Component files with .tsx, .test.tsx, .stories.tsx (Storybook), index.ts barrel files

**`src/services/`**
- Purpose: Business logic layer between components and API
- Contains: Effect definitions, server actions, API client, error handling
- Key files: `api.ts` (ApiClient), `*.effect.ts` (effect definitions), `*.ts` (server actions)

**`src/lib/`**
- Purpose: Reusable utilities and infrastructure code
- Contains: Auth helpers, Effect-TS operators, error handlers, type utilities
- Key files: `auth.ts`, `effect/` subdirectory, `errors/`, `utils.ts`

**`src/types/`**
- Purpose: Shared TypeScript types and Effect schemas
- Contains: Type definitions, schema validation
- Key files: `card.ts`, `member.ts` with Type and Schema exports

**`src/constants/`**
- Purpose: Application-wide constants
- Contains: Error messages, cache tags, revalidation times, route strings
- Key files: `error.ts`, `cache.ts`, `route.ts`

**`src/hooks/`**
- Purpose: Custom React hooks for components
- Contains: Reusable stateful logic
- Key files: `useUnsavedChanges.ts`

**Backend Structure:**

**`bank-dash-server/src/api/`**
- Purpose: Content types and API endpoints
- Contains: Controllers, routes, services, content type schemas
- Pattern: Each content type (card, member, transaction) has controllers/, routes/, services/ subdirectories

**`bank-dash-server/src/middlewares/`**
- Purpose: Strapi middleware plugins
- Contains: Custom request/response handling
- Key files: `cache-control.ts` (HTTP caching headers)

## Key File Locations

**Entry Points:**

- `bank-dash-app/src/app/layout.tsx`: Root layout, ClerkProvider, Toaster
- `bank-dash-app/src/app/(home)/layout.tsx`: Protected routes layout, auth check, Sidebar
- `bank-dash-app/src/app/(home)/dashboard/page.tsx`: Main dashboard page
- `bank-dash-app/src/app/api/webhooks/route.ts`: Clerk webhook handler
- `bank-dash-server/src/index.ts`: Strapi bootstrap and error handlers

**Configuration:**

- `bank-dash-app/tsconfig.json`: Path aliases (`@/` → `src/`)
- `bank-dash-app/next.config.js`: Turbopack, middleware
- `bank-dash-app/jest.config.js`: Jest test configuration
- `bank-dash-app/tailwind.config.ts`: Tailwind custom colors and plugins
- `bank-dash-server/.env`: Environment variables (secrets)

**Core Logic:**

- `bank-dash-app/src/services/api.ts`: ApiClient singleton with Effect-based request wrapping
- `bank-dash-app/src/services/cards.effect.ts`: Card fetch effects
- `bank-dash-app/src/services/cards.ts`: Card server actions (getCards, addCard, updateCard)
- `bank-dash-app/src/lib/effect/operators.ts`: Effect composition utilities
- `bank-dash-app/src/lib/effect/runtime.ts`: runServerEffect with DevTools integration
- `bank-dash-server/src/api/transfer/services/transfer.ts`: Atomic transfer logic with Knex transactions

**Testing:**

- `bank-dash-app/src/components/**/*.test.tsx`: Component tests
- `bank-dash-app/src/services/test/`: Service tests
- `bank-dash-app/src/lib/effect/*.test.ts`: Effect operator tests
- `bank-dash-app/src/components/**/*.stories.tsx`: Storybook stories

## Naming Conventions

**Files:**

- Components: PascalCase, one component per file: `AddCardModal.tsx`, `MyCardsSection.tsx`
- Utilities: camelCase: `maskCardNumber.ts`, `getApiBaseUrl.ts`
- Effects: `.effect.ts` suffix: `cards.effect.ts`, `transactions.effect.ts`
- Server actions: `.ts` suffix: `cards.ts`, `transfers.ts`
- Tests: `.test.ts` or `.test.tsx`: `AddCardModal.test.tsx`, `operators.test.ts`
- Storybook: `.stories.tsx`: `AddCardModal.stories.tsx`
- Barrel files: `index.ts` for re-exports: `src/components/DashboardSections/index.ts`

**Directories:**

- Feature directories: PascalCase: `components/AddCardModal/`, `components/DashboardSections/`
- Utility directories: camelCase: `lib/effect/`, `src/services/`
- Route groups: parentheses: `app/(auth)/`, `app/(home)/`
- Typed resource folders (Strapi): lowercase: `api/card/`, `api/member/`

## Where to Add New Code

**New Feature:**

1. Create feature directory in `src/components/[FeatureName]/`
2. Implement component(s) and export from `index.ts`
3. Add tests in `[FeatureName].test.tsx`
4. Add Storybook story in `[FeatureName].stories.tsx` if reusable

**New Server Action/Service:**

1. Add Effect definition in `src/services/[entity].effect.ts`:
   - Define effect returning `Effect.Effect<Result, Error>`
   - Use `requestEffect()` wrapper
   - Add span for tracing
   - Map errors to result tuple `{ data, error }`

2. Export server action in `src/services/[entity].ts`:
   - Mark with `'use server'`
   - Call effect via `runServerEffect()`
   - Return `{ data: T | null, error: string | null }`

**New Type/Schema:**

- Add to `src/types/[entity].ts`:
  - Export TypeScript `type T = ...`
  - Export Effect Schema: `const TSchema = Schema.Struct({ ... })`
  - Export derived type: `type T = typeof TSchema.Type`

**New Route/Page:**

- Create file/directory in `src/app/(group)/[path]/page.tsx`
- Use Server Components by default
- Add auth check via `getAuth()` if protected
- Wrap sections with `<Suspense>` for streaming

**New Constant:**

- Add to appropriate file in `src/constants/`:
  - Error messages → `error.ts`
  - Cache settings → `cache.ts`
  - Routes → `route.ts`

**New Hook:**

- Create file in `src/hooks/[hookName].ts`
- Use `'use client'` if component-specific
- Export function starting with `use`

## Special Directories

**`src/components/ui/`**
- Purpose: shadcn/ui primitive components (not business logic)
- Generated: Copied from shadcn/ui CLI
- Committed: Yes
- Modification: Only for project-specific customization

**`src/lib/effect/`**
- Purpose: Effect-TS infrastructure (operators, runtime, HTTP utilities)
- Generated: No
- Committed: Yes
- Modification: Only for new operators or runtime features

**`bank-dash-server/database.sqlite`**
- Purpose: SQLite database file
- Generated: Yes (created by Strapi on first run)
- Committed: No (ignored, local development only)
- Reset: Delete file to reset to empty schema

**`.next/` and `coverage/`**
- Purpose: Build artifacts and test coverage reports
- Generated: Yes
- Committed: No
- Purpose: Build cache and test analysis

---

*Structure analysis: 2026-03-18*
