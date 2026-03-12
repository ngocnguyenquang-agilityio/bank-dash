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
import { updateTag } from 'next/cache';

const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
  (updateTag as jest.Mock).mockClear();
});

describe('sendAmount', () => {
  it('returns error for zero amount', async () => {
    const result = await sendAmount('sender', 'recipient', 0, 'Sender', 'Recipient');
    expect(result.success).toBe(false);
    expect(result.error).toBe(TRANSACTION_ERRORS.INVALID_AMOUNT);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns error for negative amount', async () => {
    const result = await sendAmount('sender', 'recipient', -100, 'Sender', 'Recipient');
    expect(result.success).toBe(false);
    expect(result.error).toBe(TRANSACTION_ERRORS.INVALID_AMOUNT);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('transfers successfully via single API call', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: { success: true, error: null } }),
    });

    const result = await sendAmount('sender-clerk', 'recipient-clerk', 200, 'Sender', 'Recipient');
    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
    expect(mockFetch).toHaveBeenCalledTimes(1);

    // Verify it sends POST to /transfers with correct body
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toContain('/transfers');
    expect(options.method).toBe('POST');
    const body = JSON.parse(options.body);
    expect(body.data).toEqual({
      senderClerkId: 'sender-clerk',
      recipientClerkId: 'recipient-clerk',
      amount: 200,
      senderName: 'Sender',
      recipientName: 'Recipient',
    });
  });

  it('invalidates cache tags on success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: { success: true, error: null } }),
    });

    await sendAmount('sender', 'recipient', 100, 'Sender', 'Recipient');
    expect(updateTag).toHaveBeenCalledWith('cards');
    expect(updateTag).toHaveBeenCalledWith('transactions');
  });

  it('does not invalidate cache tags on backend validation failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: { success: false, error: 'Balance not enough' } }),
    });

    const result = await sendAmount('sender', 'recipient', 100, 'Sender', 'Recipient');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Balance not enough');
    expect(updateTag).not.toHaveBeenCalled();
  });

  it('returns error when API call fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => 'Internal Server Error',
    });

    const result = await sendAmount('sender', 'recipient', 100, 'Sender', 'Recipient');
    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('returns error on network failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await sendAmount('sender', 'recipient', 100, 'Sender', 'Recipient');
    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('returns backend error messages for insufficient balance', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: { success: false, error: 'Balance not enough' } }),
    });

    const result = await sendAmount('sender', 'recipient', 999999, 'Sender', 'Recipient');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Balance not enough');
  });

  it('returns backend error messages for blocked cards', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: { success: false, error: 'Unlock your card to transfer' } }),
    });

    const result = await sendAmount('sender', 'recipient', 100, 'Sender', 'Recipient');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Unlock your card to transfer');
  });

  it('returns backend error messages for recipient with no active card', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        data: { success: false, error: 'Recipient has no active card to receive funds' },
      }),
    });

    const result = await sendAmount('sender', 'recipient', 100, 'Sender', 'Recipient');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Recipient has no active card to receive funds');
  });
});
