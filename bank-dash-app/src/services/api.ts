// Libraries
import { Effect, Schema } from 'effect';

// Utils
import type { RequestInitExtended } from '@/lib/effect/http';
import { withAbortController } from '@/lib/effect/operators';

// Define Errors
export class ApiError extends Schema.TaggedError<ApiError>()('ApiError', {
  message: Schema.String,
  status: Schema.Number,
}) {}

export class NetworkError extends Schema.TaggedError<NetworkError>()('NetworkError', {
  message: Schema.String,
  originalError: Schema.Unknown,
}) {}

interface IApiClient {
  baseURL: string;
  headers?: HeadersInit;
}

export class ApiClient {
  baseURL: string;
  config: RequestInit;
  private static apiClientInstance: ApiClient;

  private constructor(baseURL: string, config: RequestInit) {
    this.baseURL = baseURL;
    this.config = config;
  }

  static create(params: IApiClient): ApiClient {
    const { baseURL, headers = {} } = params;

    if (!this.apiClientInstance) this.apiClientInstance = new ApiClient(baseURL, { headers });

    return this.apiClientInstance;
  }

  private request<T>(
    url: string,
    config: Omit<RequestInitExtended, 'body'> & { body?: BodyInit | null },
  ): Effect.Effect<T, ApiError | NetworkError> {
    return withAbortController<T, ApiError | NetworkError, never>((signal) =>
      Effect.tryPromise({
        try: async () => {
          const { baseUrl: configBaseUrl, next, ...restConfig } = config;
          const baseUrl = configBaseUrl || this.baseURL;
          const fullUrl = `${baseUrl}${url}`;

          const response = await fetch(fullUrl, {
            ...this.config,
            ...(restConfig as RequestInit),
            headers: {
              ...this.config.headers,
              ...config?.headers,
            },
            signal,
            ...(next !== undefined ? { next } : {}),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new ApiError({ message: errorText, status: response.status });
          }

          if (response.status === 204) {
            return { success: true } as T;
          }

          return (await response.json()) as T;
        },
        catch: (error): ApiError | NetworkError => {
          if (error instanceof ApiError) {
            return error;
          }
          return new NetworkError({ message: 'Network error', originalError: error });
        },
      }),
    );
  }

  get<T>(
    url: string,
    config: Omit<RequestInitExtended, 'body'> = {},
  ): Effect.Effect<T, ApiError | NetworkError> {
    return this.request<T>(url, config);
  }

  postFormData<T>(
    url: string,
    formData: FormData,
    config: Omit<RequestInitExtended, 'body'> = {},
  ): Effect.Effect<T, ApiError | NetworkError> {
    return this.request<T>(url, {
      ...config,
      method: 'POST',
      body: formData,
    });
  }

  post<T>(
    url: string,
    config: RequestInitExtended = {},
  ): Effect.Effect<T, ApiError | NetworkError> {
    return this.request<T>(url, {
      ...config,
      method: 'POST',
      body: config.body ? JSON.stringify(config.body) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });
  }

  put<T>(url: string, config: RequestInitExtended = {}): Effect.Effect<T, ApiError | NetworkError> {
    return this.request<T>(url, {
      ...config,
      method: 'PUT',
      body: config.body ? JSON.stringify(config.body) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });
  }

  delete<T>(
    url: string,
    config: Omit<RequestInitExtended, 'body'> = {},
  ): Effect.Effect<T, ApiError | NetworkError> {
    return this.request<T>(url, {
      ...config,
      method: 'DELETE',
    });
  }
}

export const apiClient = ApiClient.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
});
