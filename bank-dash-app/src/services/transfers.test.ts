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

import { sendAmount } from './transfers';
import { TRANSACTION_ERRORS } from '@/constants/error';

const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
});

describe('sendAmount', () => {
  it('returns error for zero amount', async () => {
    const result = await sendAmount('sender', 'recipient', 0, 'Sender', 'Recipient');
    expect(result.success).toBe(false);
    expect(result.error).toBe(TRANSACTION_ERRORS.INVALID_AMOUNT);
  });

  it('returns error for negative amount', async () => {
    const result = await sendAmount('sender', 'recipient', -100, 'Sender', 'Recipient');
    expect(result.success).toBe(false);
    expect(result.error).toBe(TRANSACTION_ERRORS.INVALID_AMOUNT);
  });

  it('transfers successfully', async () => {
    const senderCards = {
      data: [
        {
          id: 1,
          documentId: 'sender-card-1',
          balance: '1000.00',
          isActive: true,
        },
      ],
      meta: { pagination: { page: 1, pageSize: 100, pageCount: 1, total: 1 } },
    };

    const recipientCards = {
      data: [
        {
          id: 2,
          documentId: 'recipient-card-1',
          balance: '500.00',
          isActive: true,
        },
      ],
      meta: { pagination: { page: 1, pageSize: 100, pageCount: 1, total: 1 } },
    };

    // Call 1 & 2: Get sender and recipient cards (parallel)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => senderCards,
    });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => recipientCards,
    });

    // Call 3: Create sender transaction
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({ data: { documentId: 'tx-1' } }),
    });

    // Call 4: Update sender card balance
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: {} }),
    });

    // Call 5: Create recipient transaction
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({ data: { documentId: 'tx-2' } }),
    });

    // Call 6: Update recipient card balance
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: {} }),
    });

    const result = await sendAmount('sender-clerk', 'recipient-clerk', 200, 'Sender', 'Recipient');
    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
  });

  it('returns error when sender has no active cards', async () => {
    const senderCards = {
      data: [{ id: 1, documentId: 'card-1', balance: '1000.00', isActive: false }],
      meta: { pagination: { page: 1, pageSize: 100, pageCount: 1, total: 1 } },
    };

    const recipientCards = {
      data: [{ id: 2, documentId: 'card-2', balance: '500.00', isActive: true }],
      meta: { pagination: { page: 1, pageSize: 100, pageCount: 1, total: 1 } },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => senderCards,
    });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => recipientCards,
    });

    const result = await sendAmount('sender', 'recipient', 100, 'Sender', 'Recipient');
    expect(result.success).toBe(false);
    expect(result.error).toBe(TRANSACTION_ERRORS.ALL_CARDS_BLOCKED);
  });

  it('returns error when sender has insufficient balance', async () => {
    const senderCards = {
      data: [{ id: 1, documentId: 'card-1', balance: '50.00', isActive: true }],
      meta: { pagination: { page: 1, pageSize: 100, pageCount: 1, total: 1 } },
    };

    const recipientCards = {
      data: [{ id: 2, documentId: 'card-2', balance: '500.00', isActive: true }],
      meta: { pagination: { page: 1, pageSize: 100, pageCount: 1, total: 1 } },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => senderCards,
    });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => recipientCards,
    });

    const result = await sendAmount('sender', 'recipient', 100, 'Sender', 'Recipient');
    expect(result.success).toBe(false);
    expect(result.error).toBe(TRANSACTION_ERRORS.INSUFFICIENT_BALANCE);
  });

  it('returns error when recipient has no active cards', async () => {
    const senderCards = {
      data: [{ id: 1, documentId: 'card-1', balance: '1000.00', isActive: true }],
      meta: { pagination: { page: 1, pageSize: 100, pageCount: 1, total: 1 } },
    };

    const recipientCards = {
      data: [{ id: 2, documentId: 'card-2', balance: '500.00', isActive: false }],
      meta: { pagination: { page: 1, pageSize: 100, pageCount: 1, total: 1 } },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => senderCards,
    });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => recipientCards,
    });

    const result = await sendAmount('sender', 'recipient', 100, 'Sender', 'Recipient');
    expect(result.success).toBe(false);
    expect(result.error).toBe(TRANSACTION_ERRORS.RECIPIENT_NO_ACTIVE_CARD);
  });
});
