# Testing Patterns

**Analysis Date:** 2026-03-18

## Test Framework

**Runner:**
- Jest 30.2.0
- Config: `jest.config.ts`
- Environment: jsdom (for DOM-based component testing)

**Assertion Library:**
- Jest built-in matchers (expect API)
- `@testing-library/jest-dom` - DOM matchers (toBeInTheDocument, etc.)

**Run Commands:**
```bash
npm run test                    # Run all tests (watch mode)
npm run test:watch             # Jest watch mode (re-run on file changes)
npm run test:coverage          # Run with coverage report
npm run test:update            # Update snapshots with --passWithNoTests
npx jest path/to/test.spec.ts  # Run single test file
```

## Test File Organization

**Location:**
- Co-located with source files (same directory as component/service)
- Alternative: Separate `__tests__` directories via testMatch pattern

**Naming:**
- `.test.ts` suffix for tests
- `.test.tsx` for component tests
- Pattern: `ComponentName.test.tsx`, `service.test.ts`, `useHook.test.ts`

**Structure:**
```
src/
├── components/
│   ├── AddCardModal/
│   │   ├── AddCardModal.tsx
│   │   ├── AddCardModal.test.tsx
│   │   ├── AddCardModal.stories.tsx
│   │   └── index.ts
├── services/
│   ├── cards.ts
│   ├── test/
│   │   ├── cards.test.ts
│   │   ├── members.test.ts
│   │   └── transfers.test.ts
├── hooks/
│   ├── useUnsavedChanges.ts
│   └── useUnsavedChanges.test.ts
├── lib/
│   ├── effect/
│   │   ├── operators.ts
│   │   └── operators.test.ts
│   ├── errors/
│   │   ├── handleApiError.ts
│   │   └── handleApiError.test.ts
```

## Test Structure

**Suite Organization:**
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddCardModal } from '.';

// Mock setup at top level
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}));

describe('AddCardModal', () => {
  // Setup/teardown hooks
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Individual test cases
  it('renders the dialog when open', () => {
    render(<AddCardModal {...defaultProps} />);
    expect(screen.getByText('Card Type')).toBeInTheDocument();
  });

  // Nested describe blocks for related tests
  describe('form submission', () => {
    it('shows submitting state', async () => {
      // ...
    });
  });
});
```

**Patterns:**
- Setup: `beforeEach(() => { jest.clearAllMocks() })` - Clear mocks between tests
- Teardown: Not typically needed; jest.clearAllMocks() handles cleanup
- Assertions: Use testing-library queries over direct DOM access

## Mocking

**Framework:** Jest's native mocking system

**Patterns:**
```typescript
// Mock modules at file top
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

// Mock fetch for API tests
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock service functions
jest.mock('@/services/cards', () => ({
  addCard: (...args: unknown[]) => mockAddCard(...args),
}));

// Setup mock responses
mockFetch.mockResolvedValueOnce({
  ok: true,
  status: 200,
  json: async () => ({ data: [...] }),
});

// Verify calls
expect(mockFetch).toHaveBeenCalledWith(
  expect.stringContaining('/cards'),
  expect.objectContaining({ method: 'POST' })
);
```

**What to Mock:**
- Next.js hooks: `useRouter()`, `usePathname()`, `useSearchParams()`
- Third-party auth: `@clerk/nextjs` `useUser()`, `useClerk()`
- Service layers: API calls via `jest.mock('@/services/*')`
- Toast notifications: `jest.mock('sonner')`
- External libraries: `@hookform/resolvers`, date utilities if needed for deterministic tests

**What NOT to Mock:**
- React hooks: `useState`, `useCallback`, `useEffect` (test real behavior)
- Custom hooks: Test via `renderHook()` with actual logic
- UI components from `@/components/ui/` (Radix UI primitives) - import and test real rendering
- Utility functions: Test actual implementations in `src/lib/utils.ts`, `src/utils/`
- Effect operators: Test via actual Effect.runPromise() (see `operators.test.ts`)

## Fixtures and Factories

**Test Data:**
```typescript
// Default props for component tests
const defaultProps = {
  open: true,
  onOpenChange: jest.fn(),
};

// Render wrapper
render(<AddCardModal {...defaultProps} />);

// API response fixtures in service tests
const cardsData = {
  data: [{ id: 1, documentId: 'card-1', name: 'Test Card' }],
  meta: { pagination: { page: 1, pageSize: 5, pageCount: 1, total: 1 } },
};
mockFetch.mockResolvedValueOnce({
  ok: true,
  status: 200,
  json: async () => cardsData,
});
```

**Location:**
- Inline in test files (small datasets)
- Shared test data in `src/test/` directory (if large/reused)
- No factory library; simple object literals with descriptive names

## Coverage

**Requirements:** Not enforced by config

**View Coverage:**
```bash
npm run test:coverage
```

**collectCoverageFrom (jest.config.ts):**
- Includes: `src/**/*.{js,jsx,ts,tsx}`
- Excludes:
  - `.d.ts` files
  - `.stories.{js,jsx,ts,tsx}` (Storybook only)
  - `src/app/**` (Next.js pages/layouts)
  - `src/test/**` (Test utilities themselves)

## Test Types

**Unit Tests:**
- Scope: Individual functions, hooks, components in isolation
- Approach: Mock external dependencies (services, router, auth)
- Examples:
  - `operators.test.ts` - Effect utility functions
  - `utils.test.ts` - Utility functions (getInitials, getStrapiMedia, parseBalanceToCents)
  - `handleApiError.test.ts` - Error parsing logic
  - `useUnsavedChanges.test.ts` - Hook behavior via renderHook

**Integration Tests:**
- Scope: Services with mocked API, component trees with real children
- Approach: Mock fetch/API, render components tree, test interactions
- Examples:
  - `cards.test.ts` - Service functions calling mocked API endpoints
  - `AddCardModal.test.tsx` - Form submission, field validation, error handling
  - `AvatarProfile.test.tsx` - Navigation and auth interaction

**E2E Tests:**
- Framework: Not used in current setup
- Note: Project focuses on unit/integration via Jest; no Cypress, Playwright, etc.

## Common Patterns

**Async Testing:**
```typescript
// Using userEvent.setup() for async user interactions
it('formats card number with dashes as user types', async () => {
  const user = userEvent.setup();
  render(<AddCardModal {...defaultProps} />);

  const cardNumberInput = screen.getByPlaceholderText('**** **** **** ****');
  await user.type(cardNumberInput, '1234567890123456');

  expect(cardNumberInput).toHaveValue('1234-5678-9012-3456');
});

// Using waitFor for async updates
it('shows success toast after submission', async () => {
  const user = userEvent.setup();
  mockAddCard.mockResolvedValueOnce({ success: true, error: null });
  render(<AddCardModal {...defaultProps} />);

  await user.click(screen.getByRole('button', { name: 'Add Card' }));
  await waitFor(() => {
    expect(toast.success).toHaveBeenCalledWith('Card added successfully');
  });
});

// Testing Effect-based services
it('returns cards on success', async () => {
  const cardsData = { data: [...], meta: { pagination: {...} } };
  mockFetch.mockResolvedValueOnce({
    ok: true,
    status: 200,
    json: async () => cardsData,
  });

  const result = await getCards('clerk-123');
  expect(result.error).toBeNull();
  expect(result.cards).toEqual(cardsData);
});
```

**Error Testing:**
```typescript
// API error responses
it('returns error when member not found', async () => {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    status: 200,
    json: async () => ({ data: [] }),
  });

  const result = await addCard('clerk-123', cardData);
  expect(result.success).toBe(false);
  expect(result.error).toBe('Member not found');
});

// Validation errors in components
it('shows error message for invalid input', () => {
  render(<AddCardModal {...defaultProps} />);

  const cardNumberInput = screen.getByPlaceholderText('**** **** **** ****');
  // Type invalid value
  fireEvent.change(cardNumberInput, { target: { value: 'invalid' } });

  // Error displays via form validation
  expect(screen.getByText(/invalid card number/i)).toBeInTheDocument();
});

// Handling errors in hooks
it('should handle API error in async effect', async () => {
  const effect = getCardsEffect('user-123').pipe(
    Effect.catchAll(() => Effect.succeed({ cards: null, error: 'API Error' }))
  );

  const result = await Effect.runPromise(effect);
  expect(result.error).toBe('API Error');
});
```

**Form Testing Pattern:**
```typescript
// Render component with form
render(<AddCardModal open={true} onOpenChange={jest.fn()} />);

// Fill form fields
const user = userEvent.setup();
await user.type(screen.getByPlaceholderText('My Cards'), 'John Doe');
await user.type(screen.getByPlaceholderText('**** **** **** ****'), '1234567890123456');

// Verify form state changes
expect(screen.getByRole('button', { name: 'Add Card' })).toBeEnabled();

// Submit form
await user.click(screen.getByRole('button', { name: 'Add Card' }));

// Verify service was called
expect(mockAddCard).toHaveBeenCalledWith('user-123', expect.objectContaining({
  cardNumber: '1234567890123456',
  nameOnCard: 'John Doe',
}));
```

## Setup Files

**jest.setup.ts:**
- Imports `@testing-library/jest-dom` for DOM matchers
- Polyfills TextEncoder, TextDecoder, ResizeObserver
- Mocks `getBoundingClientRect()` for JSDOM (returns 800x600 by default)
- Location: `jest.setup.ts` (root)
- Loaded via `setupFilesAfterEnv` in jest.config.ts

---

*Testing analysis: 2026-03-18*
