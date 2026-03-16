import { Effect } from 'effect';

jest.mock('@/lib/effect/runtime', () => ({
  runServerEffect: (effect: Effect.Effect<unknown, unknown, never>) => Effect.runPromise(effect),
  provide: () => (effect: Effect.Effect<unknown, unknown, never>) => effect,
}));

jest.mock('next/cache', () => ({
  updateTag: jest.fn(),
  unstable_cache: jest.fn(<T extends (...args: unknown[]) => unknown>(fn: T) => fn),
  unstable_cacheTag: jest.fn(),
}));

import { getRecentTransactions, createTransaction } from '../transactions';
import { Transactions } from '@/types/card';

const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
});

describe('getRecentTransactions', () => {
  it('returns transactions on success', async () => {
    const transactionsData = {
      data: [{ id: 1, message: 'Test', amount: 100 }],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => transactionsData,
    });

    const result = await getRecentTransactions('clerk-123');
    expect(result.error).toBeNull();
    expect(result.transactions).toEqual(transactionsData);
  });

  it('returns error on failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => JSON.stringify({ error: { status: 500 } }),
    });

    const result = await getRecentTransactions('clerk-123');
    expect(result.error).toBeTruthy();
  });
});

describe('createTransaction', () => {
  it('creates transaction successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({ data: { id: 1 } }),
    });

    const result = await createTransaction({
      cardDocumentId: 'card-1',
      amount: 100,
      message: 'Test transaction',
      type: Transactions.Withdrawal,
    });

    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
  });

  it('returns error on failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => JSON.stringify({ error: { status: 500 } }),
    });

    const result = await createTransaction({
      cardDocumentId: 'card-1',
      amount: 100,
      message: 'Test transaction',
      type: Transactions.Withdrawal,
    });

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });
});
