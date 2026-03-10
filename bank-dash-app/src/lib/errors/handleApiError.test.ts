import { handleApiError } from './handleApiError';
import { MESSAGES } from '@/constants/error';

describe('handleApiError', () => {
  it('returns unexpected error for non-parseable input', () => {
    const result = handleApiError('not valid json {{{');
    expect(result).toEqual({ error: 'Failed to parse error response.' });
  });

  it('returns unexpected error message for undefined input', () => {
    const result = handleApiError(undefined);
    expect(result).toEqual({ error: MESSAGES.UNEXPECTED_ERROR });
  });

  it('handles ValidationError with field-level errors', () => {
    const errorRaw = {
      error: {
        name: 'ValidationError',
        details: {
          errors: [
            { path: ['email'], message: 'Email is required' },
            { path: ['email'], message: 'Email is invalid' },
            { path: ['name'], message: 'Name is required' },
          ],
        },
      },
    };

    const result = handleApiError(errorRaw);
    expect(result).toEqual({
      error: {
        email: ['Email is required', 'Email is invalid'],
        name: ['Name is required'],
      },
    });
  });

  it('handles ValidationError with missing path', () => {
    const errorRaw = {
      error: {
        name: 'ValidationError',
        details: {
          errors: [{ path: [], message: 'General error' }],
        },
      },
    };

    const result = handleApiError(errorRaw);
    expect(result).toEqual({ error: {} });
  });

  it('handles FORBIDDEN status', () => {
    const result = handleApiError({ error: { status: 403 } });
    expect(result).toEqual({ error: MESSAGES.NO_PERMISSION });
  });

  it('handles UNAUTHORIZED status', () => {
    const result = handleApiError({ error: { status: 401 } });
    expect(result).toEqual({ error: MESSAGES.UNAUTHORIZED });
  });

  it('handles INTERNAL_SERVER_ERROR status', () => {
    const result = handleApiError({ error: { status: 500 } });
    expect(result).toEqual({ error: MESSAGES.INTERNAL_SERVER_ERROR });
  });

  it('uses error message when available', () => {
    const result = handleApiError({ error: { message: 'Custom error message' } });
    expect(result).toEqual({ error: 'Custom error message' });
  });

  it('handles JSON string input', () => {
    const errorRaw = JSON.stringify({ error: { status: 403 } });
    const result = handleApiError(errorRaw);
    expect(result).toEqual({ error: MESSAGES.NO_PERMISSION });
  });

  it('returns unexpected error when error object has no useful info', () => {
    const result = handleApiError({ error: {} });
    expect(result).toEqual({ error: MESSAGES.UNEXPECTED_ERROR });
  });
});
