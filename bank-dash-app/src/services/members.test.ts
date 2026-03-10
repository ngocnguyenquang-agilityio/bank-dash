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

import { getMemberByClerkId, getMembers, updateMember, uploadAvatar } from './members';

const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
});

describe('getMemberByClerkId', () => {
  it('returns member on success', async () => {
    const memberData = {
      data: [{ id: 1, documentId: 'member-1', clerkId: 'clerk-123', name: 'John' }],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => memberData,
    });

    const result = await getMemberByClerkId('clerk-123');
    expect(result.error).toBeNull();
    expect(result.member).toEqual(memberData.data[0]);
  });

  it('returns null member when not found', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: [] }),
    });

    const result = await getMemberByClerkId('clerk-999');
    expect(result.member).toBeNull();
    expect(result.error).toBeNull();
  });

  it('returns error on API failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => JSON.stringify({ error: { status: 500 } }),
    });

    const result = await getMemberByClerkId('clerk-123');
    expect(result.error).toBeTruthy();
    expect(result.member).toBeNull();
  });
});

describe('getMembers', () => {
  it('returns members on success', async () => {
    const membersData = {
      data: [{ id: 1, documentId: 'member-1', name: 'Alice' }],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => membersData,
    });

    const result = await getMembers('clerk-123');
    expect(result.error).toBeNull();
    expect(result.members).toEqual(membersData);
  });

  it('returns error on failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => JSON.stringify({ error: { status: 500 } }),
    });

    const result = await getMembers('clerk-123');
    expect(result.error).toBeTruthy();
  });
});

describe('updateMember', () => {
  it('updates member successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: { id: 1, name: 'Updated' } }),
    });

    const result = await updateMember('member-1', { name: 'Updated' });
    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
  });

  it('returns error on failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => JSON.stringify({ error: { status: 500 } }),
    });

    const result = await updateMember('member-1', { name: 'Updated' });
    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });
});

describe('uploadAvatar', () => {
  it('returns error when no file provided', async () => {
    const formData = new FormData();
    const result = await uploadAvatar(formData);
    expect(result.success).toBe(false);
    expect(result.error).toBe('No file provided');
  });

  it('returns error for invalid file type', async () => {
    const formData = new FormData();
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    formData.append('file', file);

    const result = await uploadAvatar(formData);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid file type');
  });

  it('returns error for oversized file', async () => {
    const formData = new FormData();
    // Create a file > 5MB
    const largeContent = new Uint8Array(6 * 1024 * 1024);
    const file = new File([largeContent], 'large.png', { type: 'image/png' });
    formData.append('file', file);

    const result = await uploadAvatar(formData);
    expect(result.success).toBe(false);
    expect(result.error).toContain('too large');
  });

  it('uploads avatar successfully', async () => {
    const formData = new FormData();
    const file = new File(['test'], 'avatar.png', { type: 'image/png' });
    formData.append('file', file);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => [{ id: 42 }],
    });

    const result = await uploadAvatar(formData);
    expect(result.success).toBe(true);
    expect(result.fileId).toBe(42);
    expect(result.error).toBeNull();
  });

  it('returns error on upload failure', async () => {
    const formData = new FormData();
    const file = new File(['test'], 'avatar.png', { type: 'image/png' });
    formData.append('file', file);

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => JSON.stringify({ error: { status: 500 } }),
    });

    const result = await uploadAvatar(formData);
    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });
});
