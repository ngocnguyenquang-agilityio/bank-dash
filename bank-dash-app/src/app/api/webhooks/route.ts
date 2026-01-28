// Libraries
import { WebhookEvent } from '@clerk/nextjs/server';
import { Config, Data, Effect, pipe, Schema } from 'effect';

// Constants
import { MESSAGES, STATUS_CODES } from '@/constants/error';

class WebhookError extends Data.TaggedError('WebhookError')<{
  readonly MESSAGES: string;
  readonly status: number;
  readonly cause?: unknown;
}> {}

const ClerkUserDataSchema = Schema.Struct({
  id: Schema.String,
  email_addresses: Schema.Array(
    Schema.Struct({
      email_address: Schema.String,
    })
  ),
  first_name: Schema.NullOr(Schema.String),
  last_name: Schema.NullOr(Schema.String),
  username: Schema.NullOr(Schema.String),
});

const WebhookConfig = Config.all({
  apiUrl: Config.string('NEXT_PUBLIC_API_URL'),
});

const createMember = (apiUrl: string, userData: Schema.Schema.Type<typeof ClerkUserDataSchema>) =>
  Effect.tryPromise({
    try: () =>
      fetch(`${apiUrl}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            name:
              [userData.first_name, userData.last_name].filter(Boolean).join(' ') || 'New Member',
            userName: userData.username || userData.email_addresses[0]?.email_address.split('@')[0],
            email: userData.email_addresses[0]?.email_address,
            clerkId: userData.id,
          },
        }),
      }),
    catch: (e) =>
      new WebhookError({
        MESSAGES: MESSAGES.FAILED_CREATE_USER,
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        cause: e,
      }),
  }).pipe(
    Effect.flatMap((res) =>
      res.ok
        ? Effect.void
        : Effect.fail(
            new WebhookError({
              MESSAGES: MESSAGES.FAILED_CREATE_USER,
              status: STATUS_CODES.INTERNAL_SERVER_ERROR,
            })
          )
    )
  );

export const POST = async (req: Request) =>
  pipe(
    Effect.gen(function* () {
      const { apiUrl } = yield* WebhookConfig;
      const body = yield* Effect.tryPromise({
        try: () => req.json(),
        catch: (e) =>
          new WebhookError({
            MESSAGES: MESSAGES.INVALID_JSON,
            status: STATUS_CODES.BAD_REQUEST,
            cause: e,
          }),
      });

      const evt = body as WebhookEvent;

      if (evt.type === 'user.created') {
        const userData = yield* Schema.decodeUnknown(ClerkUserDataSchema)(evt.data);
        yield* createMember(apiUrl, userData);
        return new Response('Created', { status: STATUS_CODES.CREATED });
      }

      return new Response('OK', { status: STATUS_CODES.OK });
    }),
    Effect.catchAll((e) => {
      const MESSAGES = 'MESSAGES' in e ? String(e.MESSAGES) : 'Unknown error';
      const cause = 'cause' in e ? e.cause : '';
      console.error(`[Webhook Error] ${MESSAGES}`, cause);

      const status = 'status' in e ? e.status : STATUS_CODES.INTERNAL_SERVER_ERROR;
      return Effect.succeed(new Response(MESSAGES, { status }));
    }),
    Effect.runPromise
  );
