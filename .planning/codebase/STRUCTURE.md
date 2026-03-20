# Codebase Structure

**Analysis Date:** 2026-03-20

## Directory Layout

```
bank-dash/                          # Monorepo root
├── bank-dash-app/                  # Next.js 16 frontend
│   ├── src/
│   │   ├── app/                    # Next.js App Router
│   │   │   ├── (auth)/             # Public auth routes
│   │   │   ├── (home)/             # Protected home routes
│   │   │   ├── api/                # Route handlers (webhooks, etc.)
│   │   │   ├── layout.tsx           # Root layout with Clerk
│   │   │   └── page.tsx             # Root page (redirects if auth)
│   │   ├── components/              # React components
│   │   │   ├── ui/                 # shadcn-style primitives
│   │   │   ├── DashboardSections/   # Dashboard section components
│   │   │   ├── CreditCard/          # Card display component
│   │   │   └── ...                 # Feature-specific components
│   │   ├── services/                # API layer with Effect-TS
│   │   │   ├── api.ts              # ApiClient singleton
│   │   │   ├── api.effect.ts       # requestEffect wrapper
│   │   │   ├── cards.ts            # Card service (server actions)
│   │   │   ├── cards.effect.ts     # Card Effect program
│   │   │   ├── members.ts          # Member service
│   │   │   ├── transactions.ts     # Transaction service
│   │   │   └── test/               # Service tests
│   │   ├── types/                   # Zod schemas + TS types
│   │   │   ├── card.ts
│   │   │   ├── member.ts
│   │   │   ├── transaction.ts
│   │   │   └── icon.ts
│   │   ├── lib/                     # Utilities & infrastructure
│   │   │   ├── effect/             # Effect-TS runtime
│   │   │   ├── errors/             # Error handling utilities
│   │   │   ├── auth.ts             # Cached Clerk wrapper
│   │   │   └── utils.ts            # Helper functions
│   │   ├── hooks/                   # React hooks
│   │   ├── constants/               # App constants
│   │   └── utils/                   # Utility functions
│   └── package.json
│
├── bank-dash-server/                # Strapi 5 CMS backend
│   ├── src/
│   │   ├── api/                     # Domain APIs
│   │   │   ├── card/               # Card collection
│   │   │   │   ├── content-types/  # Schema definition
│   │   │   │   ├── controllers/    # Auto-generated controller
│   │   │   │   ├── services/       # Auto-generated service
│   │   │   │   └── routes/         # Auto-generated routes
│   │   │   ├── member/             # Member collection
│   │   │   ├── transaction/        # Transaction collection
│   │   │   └── transfer/           # Custom transfer endpoint
│   │   │       ├── controllers/    # Custom request handler
│   │   │       ├── services/       # Custom business logic
│   │   │       └── routes/         # Custom route definition
│   │   ├── admin/                  # Strapi admin config
│   │   ├── extensions/             # Strapi extensions
│   │   └── middlewares/            # Custom middlewares
│   ├── config/                      # Strapi configuration
│   │   └── database.ts             # DB config (SQLite default)
│   └── package.json
│
└── .planning/
    └── codebase/                    # GSD documentation
        ├── ARCHITECTURE.md
        └── STRUCTURE.md
```

## Directory Purposes

**Frontend: `bank-dash-app/src/app`**
- Purpose: Next.js App Router with two route groups: public auth and protected home
- Contains: Page components, layouts, route handlers
- Key files:
  - `layout.tsx`: Root layout wrapping app in ClerkProvider
  - `page.tsx`: Root page that redirects authenticated users
  - `(auth)/layout.tsx`, `sign-in/[[...rest]]/page.tsx`, `sign-up/[[...rest]]/page.tsx`: Auth flows
  - `(home)/layout.tsx`: Protected layout with Sidebar + DashboardHeader
  - `(home)/dashboard/page.tsx`: Main dashboard with sections
  - `(home)/cards/page.tsx`, `(home)/cards/[id]/page.tsx`: Card pages
  - `api/webhooks/route.ts`: Clerk webhook handler (POST)

**Frontend: `bank-dash-app/src/components`**
- Purpose: Reusable React components organized by feature
- Contains: UI primitives, layout components, feature-specific sections
- Key subdirectories:
  - `ui/`: Radix UI + custom styled components (buttons, dialogs, etc.)
  - `DashboardSections/`: Sections on dashboard (MyCardsSection, QuickTransferSection, RecentTransactionsSection)
  - `CreditCard/`: Card display and related components
  - `QuickTransfer/`: Quick transfer form and logic
  - `AddCardModal/`, `CardSetting/`: Modal dialogs
  - `Sidebar/`, `DashboardHeader/`: Layout components

**Frontend: `bank-dash-app/src/services`**
- Purpose: API abstraction layer using Effect-TS
- Contains: Raw fetch operations and Effect programs
- Pattern: For each domain (cards, members, transactions), two files:
  - `domain.ts`: Server actions that call Effect programs via `runServerEffect`
  - `domain.effect.ts`: Effect programs that compose ApiClient calls with error handling
- Key files:
  - `api.ts`: ApiClient singleton with HTTP methods (get, post, put, delete)
  - `api.effect.ts`: requestEffect wrapper that normalizes errors
  - `cards.ts`: getCards, addCard, getCardDetails, updateCardDetails, updateCardBalance (server actions)
  - `cards.effect.ts`: getCardsEffect (Effect program)
  - `test/`: Jest tests for service functions

**Frontend: `bank-dash-app/src/types`**
- Purpose: Zod schemas + TypeScript types colocated
- Contains: Schema definitions that produce both runtime validation and type inference
- Pattern: `Schema.Struct` definitions exported as `const`, with corresponding `type = typeof schema.Type`
- Key files:
  - `card.ts`: CardSchema, CardFormSchema, CardsResponseSchema, types
  - `member.ts`: Member types and schemas
  - `transaction.ts`: Transaction types
  - `icon.ts`: Icon prop types

**Frontend: `bank-dash-app/src/lib`**
- Purpose: Infrastructure and utilities
- Subdirectories:
  - `effect/`: Effect-TS runtime setup (`runtime.ts` with optional DevTools layer)
  - `errors/`: `handleApiError.ts` parses API responses and extracts field-level errors
  - `auth.ts`: React cache wrapper around Clerk's auth()
  - `utils.ts`: Helper functions (getApiBaseUrl, createMetadata, etc.)

**Frontend: `bank-dash-app/src/constants`**
- Purpose: Centralized constants
- Files: `error.ts` (error messages and status codes), `cache.ts` (cache tags and revalidate times), `route.ts` (route paths), `regex.ts` (validation patterns), `upload.ts` (upload config)

**Frontend: `bank-dash-app/src/hooks`**
- Purpose: Reusable React hooks
- Files: `useUnsavedChanges.ts` (modal state management for unsaved form changes)

**Frontend: `bank-dash-app/src/utils`**
- Purpose: Pure utility functions
- Contains: General-purpose helpers not tied to a specific domain

**Backend: `bank-dash-server/src/api/card`**
- Purpose: Card collection with CRUD operations
- Contains:
  - `content-types/card/schema.json`: Strapi schema definition (fields, relationships)
  - `controllers/card.ts`: Auto-generated controller using Strapi factories
  - `services/card.ts`: Auto-generated service with business logic hooks
  - `routes/card.ts`: Auto-generated REST routes (/cards GET/POST, /cards/:id GET/PUT/DELETE)

**Backend: `bank-dash-server/src/api/member`**
- Purpose: Member (user profile) collection
- Contains: Schema, controller, service, routes (auto-generated by Strapi)
- Key field: `clerkId` links members to Clerk users

**Backend: `bank-dash-server/src/api/transaction`**
- Purpose: Transaction records (deposits/withdrawals)
- Contains: Schema, controller, service, routes
- Linked to cards via many-to-many relationship `transactions_card_lnk`

**Backend: `bank-dash-server/src/api/transfer`**
- Purpose: Custom endpoint for atomic fund transfers
- Contains:
  - `controllers/transfer.ts`: Handles POST request, validates input, delegates to service
  - `services/transfer.ts`: Complex transfer logic using Knex transactions
  - `routes/transfer.ts`: Custom route definition for POST /transfers
- Not auto-generated; custom implementation to ensure atomicity

**Backend: `bank-dash-server/config`**
- Purpose: Strapi configuration
- Files: `database.ts` configures DB client (SQLite, MySQL, PostgreSQL), connection pool, SSL options

## Key File Locations

**Entry Points:**
- `bank-dash-app/src/app/layout.tsx`: Root layout, initializes Clerk provider
- `bank-dash-app/src/app/page.tsx`: Home page, redirects if authenticated
- `bank-dash-app/src/app/(home)/dashboard/page.tsx`: Main dashboard with card/transaction sections
- `bank-dash-server/src/index.ts` (implicit): Strapi initialization

**Configuration:**
- `bank-dash-app/tsconfig.json`: TypeScript config with path aliases
- `bank-dash-app/next.config.ts`: Next.js config (Turbopack, React Compiler, image remotePatterns)
- `bank-dash-app/package.json`: Frontend dependencies and scripts
- `bank-dash-server/config/database.ts`: Database connection setup
- `bank-dash-server/package.json`: Backend dependencies

**Core Logic:**
- `bank-dash-app/src/services/api.ts`: ApiClient singleton (fetch abstraction)
- `bank-dash-app/src/services/cards.ts`: Card service operations (server actions)
- `bank-dash-app/src/services/cards.effect.ts`: Card Effect programs
- `bank-dash-app/src/lib/effect/runtime.ts`: Effect-TS runtime runner
- `bank-dash-server/src/api/transfer/services/transfer.ts`: Atomic transfer logic with Knex transaction

**Testing:**
- `bank-dash-app/src/services/test/`: Service test files (cards.test.ts, members.test.ts, transfers.test.ts)
- `bank-dash-app/src/hooks/useUnsavedChanges.test.ts`: Hook tests

**Types & Schemas:**
- `bank-dash-app/src/types/card.ts`: Card Zod schemas and types
- `bank-dash-app/src/types/member.ts`: Member types
- `bank-dash-app/src/types/transaction.ts`: Transaction types

## Naming Conventions

**Files:**
- Components: PascalCase (e.g., `CreditCard.tsx`, `DashboardHeader.tsx`)
- Services: camelCase (e.g., `cards.ts`, `members.ts`)
- Types: camelCase (e.g., `card.ts`, `member.ts`)
- Utilities: camelCase (e.g., `utils.ts`)
- Hooks: camelCase (e.g., `useUnsavedChanges.ts`)
- Tests: `[name].test.ts` or `[name].spec.ts`
- Effect programs: `[domain].effect.ts` (e.g., `cards.effect.ts`)

**Directories:**
- Feature folders: PascalCase (e.g., `CreditCard/`, `DashboardSections/`)
- Utility folders: lowercase (e.g., `lib/`, `utils/`, `constants/`, `types/`, `hooks/`)
- API routes: lowercase (e.g., `api/`, `card/`, `member/`)

**Variables & Functions:**
- camelCase for all variables and function names
- PascalCase for React components and classes
- UPPER_SNAKE_CASE for constants (e.g., `CACHE_TAGS`, `STATUS_CODES`)

**Types:**
- PascalCase for all type and interface names (e.g., `Card`, `CardFormData`, `CardsResponse`)
- Suffix pattern: Use descriptive suffixes like `Response`, `FormData`, `Error`, `Params`

## Where to Add New Code

**New Feature (e.g., Savings Goals):**
1. Create component folder: `bank-dash-app/src/components/SavingsGoal/`
2. Create page: `bank-dash-app/src/app/(home)/savings/page.tsx`
3. Create service: `bank-dash-app/src/services/savings.ts` (server actions)
4. Create Effect: `bank-dash-app/src/services/savings.effect.ts` (Effect programs)
5. Create type: Add to `bank-dash-app/src/types/` (e.g., `saving.ts`)
6. Add test: `bank-dash-app/src/services/test/savings.test.ts`
7. Backend: Create `bank-dash-server/src/api/saving/` with Strapi collection files

**New Component/Module:**
- Implementation: `bank-dash-app/src/components/[FeatureName]/[ComponentName].tsx`
- If reusable UI primitive: `bank-dash-app/src/components/ui/[ComponentName].tsx`
- If hook: `bank-dash-app/src/hooks/use[HookName].ts`
- If utility: `bank-dash-app/src/lib/` or `bank-dash-app/src/utils/`

**Utilities:**
- Shared helpers: `bank-dash-app/src/lib/[domain]/` (e.g., `lib/errors/`, `lib/effect/`)
- Pure functions: `bank-dash-app/src/utils/`
- Constants: `bank-dash-app/src/constants/`

## Special Directories

**`bank-dash-app/.next`:**
- Purpose: Next.js build output
- Generated: Yes
- Committed: No (in .gitignore)

**`bank-dash-app/node_modules`:**
- Purpose: npm dependencies
- Generated: Yes
- Committed: No

**`bank-dash-server/.tmp`:**
- Purpose: Strapi temp files (SQLite database in dev)
- Generated: Yes
- Committed: No

**`bank-dash-app/src/components/ui`:**
- Purpose: shadcn-style UI primitives (buttons, dialogs, forms, etc.)
- Generated: No
- Committed: Yes (hand-written Radix UI wrappers)

**`bank-dash-app/src/services/test`:**
- Purpose: Jest tests for service layer
- Generated: No
- Committed: Yes
- Pattern: Mock fetch at global level, test Effect program composition

---

*Structure analysis: 2026-03-20*
