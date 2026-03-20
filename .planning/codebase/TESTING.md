# Testing Patterns

**Analysis Date:** 2026-03-20

## Test Framework

**Runner:**
- Jest 30.2.0
- Config: `jest.config.ts` at project root
- Environment: jsdom
- Transform: Next.js Jest setup (handles TypeScript, JSX via Turbopack)

**Assertion Library:**
- Jest built-in matchers (expect)
- `@testing-library/jest-dom` v6.9.1 for DOM assertions
- `@testing-library/react` v16.3.2 for component testing
- `@testing-library/user-event` v14.6.1 for user interaction simulation

**Run Commands:**
```bash
npm run test              # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
npx jest [file.test.ts]  # Run single test file
```

## Test File Organization

**Location:**
- Co-located with source files (same directory)
- Pattern: `[OriginalName].test.ts(x)` directly next to source
- Services tests exception: located in `src/services/test/` subdirectory

**Naming:**
- `[Component].test.tsx` for component tests
- `[Service].test.ts` for service tests
- `[Utility].test.ts` for utility/helper tests

**Structure Example Locations:**
- Components: `src/components/[ComponentName]/[ComponentName].test.tsx`
- Services: `src/services/test/[service].test.ts`
- Hooks: `src/hooks/[hookName].test.ts`
- Utils: `src/lib/errors/handleApiError.test.ts`

## Test Structure

**Suite Organization:**
```typescript
// Test grouping pattern
describe('FunctionOrComponentName', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('test case description', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

**Setup Pattern:**
```typescript
// Module mocks at top (before importing tested module)
jest.mock('next/navigation', () => ({
  useRouter: () => ({ ... }),
}));

// Global mock setup
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Per-test cleanup
beforeEach(() => {
  jest.clearAllMocks();
  mockFetch.mockReset();
});
```

**Assertion Pattern:**
- DOM queries: `screen.getByText()`, `screen.getByRole()`, `screen.queryByText()`, `screen.findByRole()`
- User interactions: `userEvent.type()`, `userEvent.click()`
- Async assertions: `waitFor()` for eventual consistency
- Jest matchers: `toBeInTheDocument()`, `toBeEnabled()`, `toEqual()`, `toHaveAttribute()`

## Mocking

**Framework:** Jest mocking via `jest.mock()`

**Patterns:**

```typescript
// Mock entire module with return value
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

// Mock with implementation function
jest.mock('@/services/cards', () => ({
  addCard: (...args: unknown[]) => mockAddCard(...args),
}));

// Global mocks for fetch-based APIs
global.fetch = jest.fn();
```

**What to Mock:**
- External libraries (Next.js, Clerk, Sonner toast notifications)
- Service layer functions (cards.ts, members.ts)
- Any dependency not being directly tested

**What NOT to Mock:**
- Components under test (render them directly)
- Internal utilities/helpers (call them directly)
- Effect-TS machinery itself (use `Effect.runPromise()` or `Effect.runPromiseExit()`)

## Fixtures and Factories

**Test Data:**
```typescript
// Inline constants for common test data
const defaultProps = {
  open: true,
  onOpenChange: jest.fn(),
};

// Data creation in test setup
const memberResponse = {
  data: [{ id: 1, documentId: 'member-1', clerkId: 'clerk-123' }],
};

// Mock fetch responses
mockFetch.mockResolvedValueOnce({
  ok: true,
  status: 200,
  json: async () => cardsData,
});
```

**Location:**
- Inline in test file at top (after imports, before describe blocks)
- No separate fixtures directory
- Reused across multiple tests in same file via `defaultProps` pattern

## Coverage

**Requirements:**
- Target: Not enforced via config (configurable via CI/CD)
- View coverage report: `npm run test:coverage`
- Generated from v8 coverage provider

**Exclusions (from coverage):**
- `.d.ts` type definition files
- `*.stories.tsx` Storybook stories
- `src/app/**` Next.js app directory
- `src/test/**` Test utilities

## Test Types

**Unit Tests:**
- Scope: Individual functions, hooks, utilities
- Approach: Jest with React Testing Library for components
- Pattern: Mock all external dependencies
- Example: `src/lib/errors/handleApiError.test.ts` tests error parsing logic
- Example: `src/services/test/api.effect.test.ts` tests Effect pipeline transformations

**Integration Tests:**
- Scope: Service functions with Effect pipelines + API calls
- Approach: Mock global fetch, test full request-response flow
- Pattern: Mock fetch responses, verify combined behavior
- Example: `src/services/test/cards.test.ts` tests getCards, addCard, updateCardDetails
- Includes validation of error handling (member not found, network failures)

**Component Tests:**
- Scope: React component behavior and UI
- Approach: React Testing Library with user events
- Pattern: Render component, simulate user interaction, assert DOM changes
- Example: `src/components/AddCardModal/AddCardModal.test.tsx`:
  - Verifies dialog renders when open prop is true
  - Tests form field formatting (card number dashes, balance commas)
  - Confirms button states based on form validity
  - Tests user interactions (typing, clicking, date picker)

**E2E Tests:**
- Framework: Not detected in codebase
- Status: Not implemented

## Common Patterns

**Async Testing:**
```typescript
// Pattern 1: Using userEvent (automatically handles async)
const user = userEvent.setup();
await user.type(input, 'text');

// Pattern 2: Using waitFor for eventual assertions
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument();
});

// Pattern 3: Effect-TS async handling
const result = await getCards('clerk-123');
expect(result.error).toBeNull();

// Pattern 4: Promise exit checking
const exit = await Effect.runPromiseExit(effect);
expect(Exit.isFailure(exit)).toBe(true);
```

**Error Testing:**
```typescript
// Service error response
it('returns error on failure', async () => {
  mockFetch.mockResolvedValueOnce({
    ok: false,
    status: 500,
    text: async () => JSON.stringify({ error: { status: 500 } }),
  });

  const result = await getCards('clerk-123');
  expect(result.error).toBeTruthy();
});

// Effect error handling
it('converts ApiError to ApiRequestError', async () => {
  const apiError = new ApiError({
    message: JSON.stringify({ error: { message: 'Not found' } }),
    status: 404,
  });

  const effect = requestEffect(Effect.fail(apiError));
  const exit = await Effect.runPromiseExit(effect);
  expect(Exit.isFailure(exit)).toBe(true);
});
```

**Form Testing:**
```typescript
// Test field formatting with user input
it('formats card number with dashes as user types', async () => {
  const user = userEvent.setup();
  render(<AddCardModal {...defaultProps} />);

  const cardNumberInput = screen.getByPlaceholderText('**** **** **** ****');
  await user.type(cardNumberInput, '1234567890123456');

  expect(cardNumberInput).toHaveValue('1234-5678-9012-3456');
});

// Test button enable/disable based on form state
it('enables Add Card button after filling required fields', async () => {
  const user = userEvent.setup();
  render(<AddCardModal {...defaultProps} />);

  await user.type(screen.getByPlaceholderText('My Cards'), 'John Doe');
  await user.type(screen.getByPlaceholderText('**** **** **** ****'), '1234567890123456');

  expect(screen.getByRole('button', { name: 'Add Card' })).toBeEnabled();
});
```

## Jest Setup

**Configuration Location:** `jest.config.ts`

**Key Settings:**
- Module name mapping: `^@/(.*)$` → `<rootDir>/src/$1`
- Test match patterns: `**/__tests__/**/*.[jt]s?(x)`, `**/?(*.)+(spec|test).[jt]s?(x)`
- Setup file: `jest.setup.ts` runs before each test
- Transform ignore patterns: Allow `@clerk` to be transformed

**Jest Setup File (`jest.setup.ts`):**
- Imports `@testing-library/jest-dom` for DOM matchers
- Polyfills TextEncoder/TextDecoder for jsdom environment
- Provides ResizeObserver polyfill
- Overrides `getBoundingClientRect()` to return non-zero dimensions (required for Radix UI)

## Test Environment Notes

- JSDOM environment for browser-like testing
- No DOM element scrolling support (mocked as needed)
- Next.js Route Handlers and navigation mocked via jest.mock()
- Clerk authentication mocked globally in component tests
- Toast notifications (Sonner) mocked to prevent side effects

