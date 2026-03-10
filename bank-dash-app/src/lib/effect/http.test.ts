import { withBaseOptions, formatMessage, formatPayload } from './http';

describe('withBaseOptions', () => {
  it('adds baseUrl from env', () => {
    const result = withBaseOptions({ method: 'GET' });
    expect(result).toHaveProperty('baseUrl');
    expect(result.method).toBe('GET');
  });

  it('handles empty options', () => {
    const result = withBaseOptions();
    expect(result).toHaveProperty('baseUrl');
  });
});

describe('formatMessage', () => {
  it('returns details when details is a string', () => {
    const error = { message: 'General error', details: 'Detailed error' };
    expect(formatMessage(error)).toBe('Detailed error');
  });

  it('returns message when details is not a string', () => {
    const error = { message: 'General error', details: { field: ['error'] } };
    expect(formatMessage(error)).toBe('General error');
  });

  it('returns message when details is undefined', () => {
    const error = { message: 'General error' };
    expect(formatMessage(error)).toBe('General error');
  });
});

describe('formatPayload', () => {
  it('returns details when present', () => {
    const details = { email: ['required'] };
    const error = { message: 'Validation error', details };
    expect(formatPayload(error)).toBe(details);
  });

  it('returns message when details is undefined', () => {
    const error = { message: 'General error' };
    expect(formatPayload(error)).toBe('General error');
  });

  it('returns string details when details is string', () => {
    const error = { message: 'General error', details: 'Specific detail' };
    expect(formatPayload(error)).toBe('Specific detail');
  });
});
