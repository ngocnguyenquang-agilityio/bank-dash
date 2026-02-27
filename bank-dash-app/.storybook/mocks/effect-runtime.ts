// Browser-safe mock for @/lib/effect/runtime
// The real runtime imports @effect/platform-node which requires Node.js APIs.
// Storybook runs in the browser, so we provide a no-op mock.

import { Effect } from 'effect';

export const provide =
  () =>
  <A, E>(effect: Effect.Effect<A, E, never>) =>
    effect;

export const runServerEffect = <A, E>(effect: Effect.Effect<A, E, never>) =>
  Effect.runPromise(effect);
