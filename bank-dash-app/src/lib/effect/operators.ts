import { Effect, Schedule } from 'effect';
import type { DurationInput } from 'effect/Duration';

export const withTimeout =
  (duration: DurationInput) =>
  <A, E, R>(fx: Effect.Effect<A, E, R>) =>
    fx.pipe(Effect.timeout(duration));

export const withNetworkRetry =
  (recurs = 2, base: DurationInput = '200 millis') =>
  <A, E, R>(fx: Effect.Effect<A, E, R>) =>
    fx.pipe(
      Effect.retry(Schedule.exponential(base).pipe(Schedule.intersect(Schedule.recurs(recurs))))
    );

export const withSpan =
  (name: string, attributes?: Record<string, string | number | boolean>) =>
  <A, E, R>(fx: Effect.Effect<A, E, R>) =>
    fx.pipe(Effect.withSpan(name, { attributes }));

export const withAbortController = <A, E, R>(
  use: (signal: AbortSignal) => Effect.Effect<A, E, R>
) =>
  Effect.scoped(
    Effect.gen(function* (_) {
      const controller = yield* _(
        Effect.acquireRelease(
          Effect.sync(() => new AbortController()),
          (c) => Effect.sync(() => c.abort('abort: scope closed'))
        )
      );
      return yield* _(use(controller.signal));
    })
  );
