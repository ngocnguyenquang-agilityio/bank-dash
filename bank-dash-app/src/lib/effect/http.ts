export type RequestInitExtended = Omit<RequestInit, 'body'> & {
  body?: object | null;
  baseUrl?: string;
};

export type FieldErrors = Record<string, string[]>;

type ErrorWithDetails = {
  message: string;
  details?: string | FieldErrors;
};

export const withBaseOptions = (
  options: RequestInitExtended | RequestInit = {}
): RequestInitExtended => ({
  ...(options as RequestInitExtended),
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
});

export const formatMessage = (error: ErrorWithDetails) =>
  typeof error.details === 'string' ? error.details : error.message;

export const formatPayload = (error: ErrorWithDetails) => error.details ?? error.message;
