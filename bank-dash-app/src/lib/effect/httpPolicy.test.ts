import { Effect } from 'effect';
import { httpPolicy, httpGetPolicy, httpMutatePolicy } from './httpPolicy';

describe('httpPolicy', () => {
  it('applies policy to a successful effect', async () => {
    const effect = Effect.succeed('data').pipe(httpPolicy({ name: 'test-policy' }));

    const result = await Effect.runPromise(effect);
    expect(result).toBe('data');
  });

  it('applies custom options', async () => {
    const effect = Effect.succeed('data').pipe(
      httpPolicy({
        name: 'custom-policy',
        timeout: '10 seconds',
        retries: 1,
        baseDelay: '100 millis',
        attributes: { key: 'value' },
      }),
    );

    const result = await Effect.runPromise(effect);
    expect(result).toBe('data');
  });

  it('applies policy with logRetry enabled', async () => {
    const effect = Effect.succeed('data').pipe(
      httpPolicy({ name: 'logged-policy', logRetry: true }),
    );

    const result = await Effect.runPromise(effect);
    expect(result).toBe('data');
  });
});

describe('httpGetPolicy', () => {
  it('creates a GET policy that wraps effect', async () => {
    const effect = Effect.succeed('get-data').pipe(httpGetPolicy({ name: 'get-test' }));

    const result = await Effect.runPromise(effect);
    expect(result).toBe('get-data');
  });
});

describe('httpMutatePolicy', () => {
  it('creates a mutate policy that wraps effect', async () => {
    const effect = Effect.succeed('mutate-data').pipe(httpMutatePolicy({ name: 'mutate-test' }));

    const result = await Effect.runPromise(effect);
    expect(result).toBe('mutate-data');
  });
});
