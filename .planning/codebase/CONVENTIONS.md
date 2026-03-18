# Coding Conventions

**Analysis Date:** 2026-03-18

## Naming Patterns

**Files:**
- Components: PascalCase, e.g., `AddCardModal.tsx`, `AvatarProfile.tsx`
- Services: camelCase, e.g., `cards.ts`, `members.ts`, `transfers.ts`
- Effects: camelCase with `.effect.ts` suffix, e.g., `cards.effect.ts`, `api.effect.ts`
- Tests: Same name as source with `.test.ts` or `.spec.ts` suffix, e.g., `AddCardModal.test.tsx`, `cards.test.ts`
- Storybook stories: Same name as component with `.stories.tsx` suffix, e.g., `AddCardModal.stories.tsx`
- Hooks: camelCase with `use` prefix, e.g., `useUnsavedChanges.ts`
- Barrel exports: `index.ts` in component directories, e.g., `AddCardModal/index.ts` exports `{ AddCardModal }`

**Functions:**
- camelCase, e.g., `getCards()`, `addCard()`, `formatCardNumber()`, `maskCardNumber()`
- Async server functions use imperative verbs: `get*`, `add*`, `update*`, `send*`
- Effect functions append `Effect` suffix: `getCardsEffect()`, `addCardEffect()`

**Variables:**
- camelCase for constants and variables, e.g., `isPhysical`, `cardNumber`, `isDirty`
- Boolean prefixes: `is`, `has`, `show`, `can` (e.g., `isDirty`, `isSubmitting`, `showUnsavedChanges`)
- State from hooks: `const [isOpen, setIsOpen]` pattern

**Types:**
- PascalCase with descriptive names, e.g., `Card`, `CardFormData`, `MembersResponse`
- Schema types derive from `Schema.Type` pattern, e.g., `type Card = typeof CardSchema.Type`
- Interfaces for component props: `Props` suffix optional, e.g., `AddCardModalProps`
- Enums: PascalCase, e.g., `CardTypes`, `Transactions`

## Code Style

**Formatting:**
- Prettier configured with:
  - `semi: true` - Require semicolons
  - `singleQuote: true` - Use single quotes
  - `tabWidth: 2` - 2-space indentation
  - `trailingComma: 'all'` - Trailing commas in multi-line constructs
  - `printWidth: 100` - Line wrapping at 100 characters
- File: `.prettierrc`

**Linting:**
- ESLint with flat config format (ESLint 9+)
- Configuration: `eslint.config.mjs`
- Rules enforced:
  - `no-multiple-empty-lines`: Max 1 blank line, no EOF blank lines
  - Next.js recommended rules (via `eslint-config-next`)
  - TypeScript strict rules (via `eslint-config-next/typescript`)
  - Prettier compatibility (via `eslint-config-prettier`)
  - Storybook rules (via `eslint-plugin-storybook`)

**TypeScript Strictness:**
- `strict: true` - All strict type-checking options enabled
- `noUnusedLocals: true` - Error on unused local variables
- `noUnusedParameters: true` - Error on unused function parameters
- `noImplicitReturns: true` - Function must return in all code paths
- `noUncheckedIndexedAccess: true` - Index access requires type checks

## Import Organization

**Order:**
1. Library imports (React, Next.js, third-party) - `import { ... } from 'library'`
2. Type-only imports - `import type { ... } from ...`
3. Internal absolute imports - `import { ... } from '@/...'`
4. Comments grouping sections

**Path Aliases (tsconfig.json):**
- `@/*` → `./src/*` - Root alias
- `@/components/*` → `./src/components/*` - Components
- `@/domain/*` → `./src/domain/*` - Domain models
- `@/services/*` → `./src/services/*` - Services
- `@/effects/*` → `./src/effects/*` - Effect utilities
- `@/hooks/*` → `./src/hooks/*` - Custom hooks
- `@/lib/*` → `./src/lib/*` - Utilities and helpers
- `@/test/*` → `./src/test/*` - Test utilities

**Barrel Files:**
- Used in component directories: `export { ComponentName } from './ComponentName'`
- Enables cleaner imports: `import { AddCardModal } from '@/components'` instead of full path

## Error Handling

**Pattern:**
- Result type: `{ error: string | null }` paired with data fields
- Example: `{ cards: CardsResponse | null, error: string | null }`
- Service functions return generic `ServiceResult<T>` type:
  ```typescript
  type ServiceResult<T extends Record<string, unknown> = Record<string, never>> = {
    error: string | null;
  } & T;
  ```

**Effect-based Error Handling:**
- All API operations use `Effect.catchAll()` to transform failures into result objects
- Never throw errors from services; always return error in result
- Example from `cards.ts`:
  ```typescript
  Effect.catchAll((error) =>
    Effect.succeed({ success: false, error: error.message || CARD_ERRORS.ADD_CARD_FAILED }),
  )
  ```

**Error Messages:**
- Centralized in `src/constants/error.ts`:
  - `CARD_ERRORS` - Card operation messages
  - `TRANSACTION_ERRORS` - Transaction operation messages
  - `NOT_FOUND_ERRORS` - Resource not found messages
  - `MESSAGES` - Generic error messages
- Components display errors via Toast notifications using Sonner: `toast.error(error || 'Failed')`

**API Error Handling:**
- Custom error class: `ApiRequestError` in `src/services/api.effect.ts`
- Caught via `Effect.catchTags({ ApiError: ..., NetworkError: ... })`
- Field-level validation errors extracted from response for form display

## Logging

**Framework:** `console` (native JavaScript) with prefixes for context

**Patterns:**
- API errors logged with context prefix: `console.error('[API Error]', { message, status, cause })`
- Logged in `src/services/api.effect.ts` in `createApiError()` function
- No external logging service configured; console logs available in browser DevTools

## Comments

**When to Comment:**
- JSDoc for public functions, especially complex logic
- Inline comments for non-obvious business logic (e.g., format transformations)
- Comments explain "why", not "what" (code should be self-documenting for "what")

**JSDoc/TSDoc:**
- Used for utility functions with explanations
- Example from `src/lib/utils.ts`:
  ```typescript
  /**
   * Returns the Strapi API base URL.
   */
  export function getApiBaseUrl(): string { ... }
  ```
- Not required for simple component props or obvious functions

## Function Design

**Size:**
- No explicit line limit but keep functions focused on single responsibility
- Complex components/utilities (>100 lines): Consider extracting sub-utilities
- Example: `AddCardModal.tsx` at ~343 lines organizes form fields into semantic sections with comments

**Parameters:**
- Prefer object destructuring for multiple parameters:
  ```typescript
  interface AddCardModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }
  export const AddCardModal = ({ open, onOpenChange }: AddCardModalProps) => { ... }
  ```
- Service functions use positional params for clarity: `getCards(userClerkId, page, pageSize)`

**Return Values:**
- Async service functions return typed Promise results: `Promise<ServiceResult<{ cards: ... }>>`
- Effects return `Effect.Effect<T, Error>` with explicit error handling
- Components return JSX or null, use React hooks for state management

## Module Design

**Exports:**
- Prefer named exports over default exports (enables better refactoring)
- Component example: `export const AddCardModal = ...` not `export default`
- Service functions exported as named: `export const getCards = ...`, `export const addCard = ...`

**Barrel Files:**
- Used strategically in component directories
- Pattern: `src/components/AddCardModal/index.ts` exports the component
- Enables: `import { AddCardModal } from '@/components'` style imports (when re-exported from parent index)

**Organization by Concern:**
- Services handle API/data: `src/services/cards.ts`, `src/services/transfers.ts`
- Effects define async operations: `src/services/cards.effect.ts`
- Components for UI: `src/components/AddCardModal/`
- Hooks for behavior: `src/hooks/useUnsavedChanges.ts`
- Types/schemas: `src/types/card.ts`, `src/types/member.ts`
- Utilities: `src/lib/utils.ts`, `src/lib/errors/handleApiError.ts`

---

*Convention analysis: 2026-03-18*
