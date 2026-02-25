import { NodeSocket } from '@effect/platform-node';
import { Effect, Layer } from 'effect';
import { DevTools } from '@effect/experimental';

const DEVTOOLS_URL = process.env.EFFECT_DEVTOOLS_URL ?? 'ws://localhost:34437';
const DEVTOOLS_ENABLED =
  process.env.EFFECT_DEVTOOLS === 'true' && process.env.NODE_ENV === 'development';

let devToolsLayer: Layer.Layer<never> | null = null;

const getDevToolsLayer = () => {
  if (devToolsLayer) return devToolsLayer;

  try {
    const wsLayer = DevTools.layerWebSocket(DEVTOOLS_URL).pipe(
      Layer.provide(NodeSocket.layerWebSocketConstructor),
      Layer.catchAll(() => Layer.empty),
    );

    devToolsLayer = Layer.mergeAll(
      wsLayer,
      Layer.setTracerEnabled(true),
      Layer.setTracerTiming(true),
    );
  } catch (error) {
    console.warn('DevTools initialization failed:', error);
    devToolsLayer = Layer.empty;
  }

  return devToolsLayer;
};

export const provide =
  (layer: Layer.Layer<never>) =>
  <A, E>(effect: Effect.Effect<A, E, never>) =>
    Effect.provide(effect, layer);

const withDevTools = DEVTOOLS_ENABLED
  ? provide(getDevToolsLayer())
  : <A, E>(effect: Effect.Effect<A, E, never>) => effect;

export const runServerEffect = <A, E>(effect: Effect.Effect<A, E, never>) =>
  Effect.runPromise(withDevTools(effect));
