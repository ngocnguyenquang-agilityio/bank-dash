import { Effect, Layer } from 'effect';

// Mock the problematic dependencies
jest.mock('@effect/platform-node', () => ({
  NodeSocket: {
    layerWebSocketConstructor: Layer.empty,
  },
}));

jest.mock('@effect/experimental', () => ({
  DevTools: {
    layerWebSocket: () => Layer.empty,
  },
}));

import { runServerEffect, provide } from './runtime';

describe('runServerEffect', () => {
  it('executes a successful effect', async () => {
    const result = await runServerEffect(Effect.succeed('hello'));
    expect(result).toBe('hello');
  });

  it('executes an effect that returns an object', async () => {
    const result = await runServerEffect(Effect.succeed({ data: 42 }));
    expect(result).toEqual({ data: 42 });
  });

  it('rejects on effect failure', async () => {
    await expect(runServerEffect(Effect.fail(new Error('test error')))).rejects.toBeDefined();
  });
});

describe('provide', () => {
  it('provides a layer to an effect', async () => {
    const effect = Effect.succeed('provided');
    const wrapped = provide(Layer.empty)(effect);
    const result = await Effect.runPromise(wrapped);
    expect(result).toBe('provided');
  });
});
