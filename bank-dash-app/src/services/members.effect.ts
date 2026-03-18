// Libraries
import { Effect } from 'effect';

// Services
import { apiClient } from '@/services/api';
import { requestEffect } from '@/services/api.effect';

// Types
import type { MembersResponse } from '@/types/member';

// Constants
import { CACHE_TAGS, REVALIDATE } from '@/constants/cache';
import { MEMBER_ERRORS } from '@/constants/error';

export const getMembersEffect = (currentClerkId: string) => {
  const url = `/members?populate=*&filters[clerkId][$ne]=${currentClerkId}&pagination[pageSize]=100`;

  return requestEffect(
    apiClient.get<MembersResponse>(url, {
      next: {
        revalidate: REVALIDATE.MEMBERS,
        tags: [CACHE_TAGS.MEMBERS],
      },
    }),
  ).pipe(
    Effect.map((members) => ({ members, error: null as string | null })),
    Effect.catchAll((error) =>
      Effect.succeed({
        members: null as MembersResponse | null,
        error: error.message || MEMBER_ERRORS.GET_MEMBERS_FAILED,
      }),
    ),
    Effect.withSpan('getMembersEffect', { attributes: { currentClerkId } }),
  );
};
