import { Effect } from 'effect';
import { withTimeout, withNetworkRetry, withSpan, withAbortController } from './operators';

describe('operators', () => {
  describe('withTimeout', () => {
    it('succeeds when effect completes before timeout', async () => {
      const effect = Effect.succeed('ok').pipe(withTimeout('1 seconds'));
      const result = await Effect.runPromise(effect);
      expect(result).toBe('ok');
    });
  });

  describe('withNetworkRetry', () => {
    it('retries on failure and succeeds', async () => {
      let attempts = 0;
      const effect = Effect.gen(function* () {
        attempts++;
        if (attempts < 2) {
          return yield* Effect.fail(new Error('network error'));
        }
        return 'ok';
      }).pipe(withNetworkRetry(2, '10 millis'));

      const result = await Effect.runPromise(effect);
      expect(result).toBe('ok');
      expect(attempts).toBe(2);
    });

    it('fails after exhausting retries', async () => {
      let attempts = 0;
      const effect = Effect.gen(function* () {
        attempts++;
        return yield* Effect.fail('always fails');
      }).pipe(withNetworkRetry(2, '10 millis'));

      await expect(Effect.runPromise(effect)).rejects.toBeDefined();
      expect(attempts).toBe(3); // initial + 2 retries
    });
  });

  describe('withSpan', () => {
    it('passes through the effect value', async () => {
      const effect = Effect.succeed(42).pipe(withSpan('test-span'));
      const result = await Effect.runPromise(effect);
      expect(result).toBe(42);
    });

    it('passes through the effect value with attributes', async () => {
      const effect = Effect.succeed('data').pipe(withSpan('test-span', { key: 'value', num: 123 }));
      const result = await Effect.runPromise(effect);
      expect(result).toBe('data');
    });
  });

  describe('withAbortController', () => {
    it('provides an AbortSignal to the effect', async () => {
      let receivedSignal: AbortSignal | null = null;

      const effect = withAbortController((signal) => {
        receivedSignal = signal;
        return Effect.succeed('done');
      });

      const result = await Effect.runPromise(effect);
      expect(result).toBe('done');
      expect(receivedSignal).not.toBeNull();
      expect(receivedSignal!.aborted).toBe(true); // aborted after scope closes
    });
  });
});
