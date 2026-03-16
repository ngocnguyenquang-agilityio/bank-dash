import { Effect, Exit } from 'effect';
import { requestEffect } from '../api.effect';
import { ApiError, NetworkError } from '../api';

describe('requestEffect', () => {
  it('passes through successful result', async () => {
    const effect = requestEffect(Effect.succeed({ data: 'ok' }));
    const result = await Effect.runPromise(effect);
    expect(result).toEqual({ data: 'ok' });
  });

  it('converts ApiError to ApiRequestError', async () => {
    const apiError = new ApiError({
      message: JSON.stringify({ error: { message: 'Not found' } }),
      status: 404,
    });

    const effect = requestEffect(Effect.fail(apiError));
    const exit = await Effect.runPromiseExit(effect);

    expect(Exit.isFailure(exit)).toBe(true);
  });

  it('converts NetworkError to ApiRequestError', async () => {
    const networkError = new NetworkError({
      message: 'Network error',
      originalError: new Error('fetch failed'),
    });

    const effect = requestEffect(Effect.fail(networkError));
    const exit = await Effect.runPromiseExit(effect);

    expect(Exit.isFailure(exit)).toBe(true);
  });

  it('fails when result contains error field', async () => {
    const effect = requestEffect(Effect.succeed({ error: { message: 'Validation failed' } }));
    const exit = await Effect.runPromiseExit(effect);

    expect(Exit.isFailure(exit)).toBe(true);
  });

  it('passes through when result has null error field', async () => {
    const effect = requestEffect(Effect.succeed({ data: 'ok', error: null }));
    const result = await Effect.runPromise(effect);
    expect(result).toEqual({ data: 'ok', error: null });
  });
});
