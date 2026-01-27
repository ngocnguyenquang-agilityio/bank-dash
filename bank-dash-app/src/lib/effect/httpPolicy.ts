import { Effect } from 'effect';
import type { DurationInput } from 'effect/Duration';
import { withNetworkRetry, withSpan, withTimeout } from './operators';

export type HttpPolicyOptions = {
  name: string;
  timeout?: DurationInput;
  retries?: number;
  baseDelay?: DurationInput;
  attributes?: Record<string, string | number | boolean>;
  logRetry?: boolean;
};

export const httpPolicy =
  (opts: HttpPolicyOptions) =>
  <A, E, R>(fx: Effect.Effect<A, E, R>) => {
    const timeout = opts.timeout ?? '5 seconds';
    const retries = opts.retries ?? 2;
    const base = opts.baseDelay ?? '200 millis';

    return fx.pipe(
      withTimeout(timeout),
      opts.logRetry
        ? Effect.tapError((e) =>
            Effect.log(`retrying ${opts.name}: ${e instanceof Error ? e.message : String(e)}`)
          )
        : (x) => x,
      withNetworkRetry(retries, base),
      withSpan(opts.name, opts.attributes)
    );
  };

export const httpGetPolicy = (opts: Omit<HttpPolicyOptions, 'timeout' | 'retries'>) =>
  httpPolicy({ timeout: '5 seconds', retries: 2, logRetry: true, ...opts });

export const httpMutatePolicy = (opts: Omit<HttpPolicyOptions, 'timeout' | 'retries'>) =>
  httpPolicy({ timeout: '10 seconds', retries: 2, logRetry: true, ...opts });
