// Constants
import { MESSAGES, STATUS_CODES } from '@/constants/error';

type FieldErrors = Record<string, string[]>;

interface ParsedError {
  error: string | FieldErrors;
}

export const handleApiError = (errorRaw: unknown): ParsedError => {
  let message = MESSAGES.UNEXPECTED_ERROR;

  try {
    const parsed = typeof errorRaw === 'string' ? JSON.parse(errorRaw) : errorRaw;
    const errorObj = parsed?.error;

    if (errorObj?.name === 'ValidationError' && Array.isArray(errorObj?.details?.errors)) {
      const fieldErrors: FieldErrors = {};

      for (const err of errorObj.details.errors) {
        const key = err.path?.[0];
        if (key) {
          if (!fieldErrors[key]) fieldErrors[key] = [];
          fieldErrors[key].push(err.message);
        }
      }

      return { error: fieldErrors };
    }

    if (errorObj?.status === STATUS_CODES.FORBIDDEN) message = MESSAGES.NO_PERMISSION;
    else if (errorObj?.status === STATUS_CODES.UNAUTHORIZED) message = MESSAGES.UNAUTHORIZED;
    else if (errorObj?.status === STATUS_CODES.INTERNAL_SERVER_ERROR)
      message = MESSAGES.INTERNAL_SERVER_ERROR;
    else if (typeof errorObj?.message === 'string') message = errorObj.message;
  } catch {
    message = 'Failed to parse error response.';
  }

  return { error: message };
};
