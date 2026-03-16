import { Effect } from 'effect';

// Mock runtime BEFORE importing services
jest.mock('@/lib/effect/runtime', () => ({
  runServerEffect: (effect: Effect.Effect<unknown, unknown, never>) => Effect.runPromise(effect),
  provide: () => (effect: Effect.Effect<unknown, unknown, never>) => effect,
}));

// Mock next/cache
jest.mock('next/cache', () => ({
  updateTag: jest.fn(),
  unstable_cache: jest.fn(<T extends (...args: unknown[]) => unknown>(fn: T) => fn),
  unstable_cacheTag: jest.fn(),
}));

import { getCards, addCard, getCardDetails, updateCardDetails, updateCardBalance } from '../cards';

// Set up fetch mock
const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
});

describe('getCards', () => {
  it('returns cards on success', async () => {
    const cardsData = {
      data: [{ id: 1, documentId: 'card-1', name: 'Test Card' }],
      meta: { pagination: { page: 1, pageSize: 5, pageCount: 1, total: 1 } },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => cardsData,
    });

    const result = await getCards('clerk-123');
    expect(result.error).toBeNull();
    expect(result.cards).toEqual(cardsData);
  });

  it('returns error on failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => JSON.stringify({ error: { status: 500 } }),
    });

    const result = await getCards('clerk-123');
    expect(result.error).toBeTruthy();
  });
});

describe('addCard', () => {
  it('creates a card successfully', async () => {
    const memberResponse = {
      data: [{ id: 1, documentId: 'member-1', clerkId: 'clerk-123' }],
    };

    // First call: get member
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => memberResponse,
    });

    // Second call: create card
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({ data: { id: 1 } }),
    });

    const result = await addCard('clerk-123', {
      cardNumber: '1234567890123456',
      nameOnCard: 'Test User',
      expiration: '2027-12',
      isPhysical: true,
      address: '123 Main St',
      balance: '1000',
    });

    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
  });

  it('returns error when member not found', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: [] }),
    });

    const result = await addCard('clerk-123', {
      cardNumber: '1234567890123456',
      nameOnCard: 'Test User',
      expiration: '2027-12',
      isPhysical: true,
      address: '123 Main St',
      balance: '1000',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Member not found');
  });
});

describe('getCardDetails', () => {
  it('returns card details on success', async () => {
    const cardData = { data: { id: 1, documentId: 'card-1', name: 'Test Card' } };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => cardData,
    });

    const result = await getCardDetails('card-1');
    expect(result.error).toBeNull();
    expect(result.card).toEqual(cardData.data);
  });

  it('returns error on API failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: async () => JSON.stringify({ error: { message: 'Not found' } }),
    });

    const result = await getCardDetails('card-999');
    expect(result.error).toBeTruthy();
    expect(result.card).toBeNull();
  });
});

describe('updateCardDetails', () => {
  it('updates card details successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: { id: 1, name: 'Updated Card' } }),
    });

    const result = await updateCardDetails('card-1', { nameOnCard: 'New Name' });
    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
  });

  it('returns error on failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => JSON.stringify({ error: { status: 500 } }),
    });

    const result = await updateCardDetails('card-1', { nameOnCard: 'New Name' });
    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });
});

describe('updateCardBalance', () => {
  it('updates balance successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: { id: 1, balance: '500.00' } }),
    });

    const result = await updateCardBalance('card-1', '500.00');
    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
  });

  it('returns error on failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => JSON.stringify({ error: { status: 500 } }),
    });

    const result = await updateCardBalance('card-1', '500.00');
    expect(result.success).toBe(false);
  });
});
