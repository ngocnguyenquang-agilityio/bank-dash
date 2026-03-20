# Coding Conventions

**Analysis Date:** 2026-03-20

## Naming Patterns

**Files:**
- Components: `PascalCase.tsx` (e.g., `CreditCard.tsx`, `AddCardModal.tsx`)
- Services: `camelCase.ts` (e.g., `cards.ts`, `members.ts`)
- Hooks: `camelCase.ts` starting with `use` (e.g., `useUnsavedChanges.ts`)
- Utilities: `camelCase.ts` (e.g., `utils.ts`)
- Tests: `[original-name].test.ts(x)` or in `test/` subdirectory (e.g., `cards.test.ts`, `api.effect.test.ts`)
- Storybook stories: `[Component].stories.tsx`
- Barrel exports: `index.ts`

**Functions:**
- camelCase for all functions (service functions, hooks, utilities)
- Async functions return `Promise<T>` explicitly
- Effect-based operations suffixed with `Effect` (e.g., `getCardsEffect`, `requestEffect`)

**Variables:**
- camelCase for variables and constants in code
- UPPER_SNAKE_CASE for exported constant objects (e.g., `MESSAGES`, `CARD_ERRORS`, `STATUS_CODES`)

**Types:**
- PascalCase for type names and interfaces
- Props interfaces suffixed with `Props` (e.g., `CreditCardProps`)
- Schema types from Effect/Zod: `[Entity]Schema`, types inferred as `typeof [Entity]Schema.Type`

**Directories:**
- kebab-case for component directories (e.g., `add-card-modal/`, though `AddCardModal/` is used)
- camelCase for feature directories (e.g., `components/`, `services/`, `hooks/`)
- No underscores in directory names

## Code Style

**Formatting:**
- Prettier with:
  - `semi: true` - Always include semicolons
  - `singleQuote: true` - Use single quotes for strings
  - `tabWidth: 2` - 2-space indentation
  - `trailingComma: "all"` - Trailing commas in all multiline structures
  - `printWidth: 100` - Line length max 100 characters

**Linting:**
- ESLint 9 with flat config format (`eslint.config.mjs`)
- Extends:
  - `eslint-config-next/core-web-vitals` - Next.js best practices
  - `eslint-config-next/typescript` - TypeScript support
  - `eslint-config-prettier` - Prettier integration
  - `eslint-plugin-storybook` - Storybook plugin
- Custom rule: `no-multiple-empty-lines` with max 1 blank line

**TypeScript:**
- Strict mode enabled across all compiler options
- Key settings in `tsconfig.json`:
  - `strict: true`
  - `noUnusedLocals: true`
  - `noUnusedParameters: true`
  - `noImplicitReturns: true`
  - `noImplicitAny: true`
  - `noUncheckedIndexedAccess: true`

## Import Organization

**Order:**
1. Library imports (React, Next.js, third-party packages)
2. Service imports (from `@/services/*`)
3. Type imports (from `@/types/*`)
4. Component imports (from `@/components/*`)
5. Utility/lib imports (from `@/lib/*`)
6. Constants imports (from `@/constants/*`)
7. Hook imports (from `@/hooks/*`)

**Path Aliases:**
Defined in `tsconfig.json`:
- `@/*` → `src/*` (general catch-all)
- `@/components/*` → `src/components/*`
- `@/domain/*` → `src/domain/*`
- `@/services/*` → `src/services/*`
- `@/effects/*` → `src/effects/*`
- `@/hooks/*` → `src/hooks/*`
- `@/lib/*` → `src/lib/*`
- `@/test/*` → `src/test/*`

**Barrel Files:**
- Used in component directories via `index.ts`
- Pattern: `export { ComponentName } from './ComponentName'`
- Example: `src/components/CreditCard/index.ts` exports `CreditCard` component

## Error Handling

**Patterns:**
- Service functions return `ServiceResult<T>` type combining `{ error: string | null } & T`
- Effect-TS is used for typed async error handling with `ApiError | NetworkError` union
- Error types: `ApiError` (with `message` and `status`), `NetworkError` (with `message` and `originalError`)
- Service functions use `Effect.catchAll()` to convert errors to structured responses
- Field validation errors collected as `Record<string, string[]>` mapping field names to error messages
- Error messages centralized in `/src/constants/error.ts` as constant objects
- Error parsing in `@/lib/errors/handleApiError.ts` converts raw errors to structured format

**Logging:**
- Use `console.error()` with context object for errors in Effect pipelines
- Format: `console.error('[Context]', { message, status, cause })`
- Example: `console.error('[API Error]', { message: error, status, cause: errorRaw })`
- Warnings logged with prefixed strings like `[API Error]`, `[Webhook Error]`

## Comments

**When to Comment:**
- Document public function/type purposes, especially in service layer
- Explain non-obvious business logic
- Mark TODO/FIXME for future improvements (none currently in codebase)

**JSDoc/TSDoc:**
- Use minimal JSDoc for utility functions with side effects or unclear behavior
- Example format in `utils.ts`:
  ```typescript
  /**
   * Returns the Strapi API base URL.
   */
  export const getApiBaseUrl = (): string => { ... }
  ```

## Function Design

**Size:**
- Keep functions focused on single responsibility
- Service functions typically 20-40 lines including Effect pipeline setup
- Component functions vary widely (50-130+ lines typical)

**Parameters:**
- Use destructuring for object parameters in components (destructure in function signature)
- Effect-based operations accept parameters directly (not destructured)
- Optional parameters marked with `?` in types

**Return Values:**
- Async service functions return `Promise<ServiceResult<T>>`
- Effect operations return `Effect.Effect<T, ErrorType>`
- Components return `JSX.Element`
- Hooks return custom return types (usually objects with multiple return values)

## Module Design

**Exports:**
- Named exports for components, services, and utilities
- Default exports used occasionally (e.g., `export default CreditCard`)
- Barrel files use named exports from module

**File Organization Pattern:**
- Comment sections organize imports: `// Libraries`, `// Services`, `// Types`, `// Components`, etc.
- Effect pipeline operations chained with `.pipe()` for readability
- Service functions compose Effect operations with `Effect.flatMap()`, `Effect.map()`, `Effect.catchAll()`

**Async/Server Functions:**
- Marked with `'use server'` at top of file (`src/services/cards.ts`)
- Called from client components via imports
- Never call own Route Handlers from Server Components

**Client vs Server Components:**
- Client components marked with `'use client'` at top
- Components in `src/services/` are server-only
- Most pages and components are client components due to interactivity
- Server Components used for layout and static structure only

