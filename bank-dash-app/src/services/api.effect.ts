// Libraries
import { Data, Effect } from 'effect';

// Services
import type { ApiError, NetworkError } from './api';

// Utils
import { handleApiError } from '@/lib/errors/handleApiError';

type FieldErrors = Record<string, string[]>;

export class ApiRequestError extends Data.TaggedError('ApiRequestError')<{
  message: string;
  details?: string | FieldErrors;
  status?: number;
  cause?: unknown;
}> {}

const createApiError = (errorRaw: unknown, status?: number): ApiRequestError => {
  const { error } = handleApiError(errorRaw);

  if (typeof error === 'string') {
    return new ApiRequestError({ message: error, status, cause: errorRaw });
  }

  return new ApiRequestError({
    message: 'Validation error',
    details: error,
    status,
    cause: errorRaw,
  });
};

export const requestEffect = <T>(
  effect: Effect.Effect<T, ApiError | NetworkError>
): Effect.Effect<T, ApiRequestError> =>
  effect.pipe(
    Effect.catchTags({
      ApiError: (e) => Effect.fail(createApiError(e.message, e.status)),
      NetworkError: (e) => Effect.fail(createApiError(e.message, 503)),
    }),
    Effect.flatMap((result) => {
      // Handle cases where result is { error: ... } even if status is 200
      if (
        result &&
        typeof result === 'object' &&
        'error' in result &&
        (result as Record<string, unknown>).error !== undefined &&
        (result as Record<string, unknown>).error !== null
      ) {
        return Effect.fail(createApiError((result as Record<string, unknown>).error));
      }
      return Effect.succeed(result);
    })
  );
