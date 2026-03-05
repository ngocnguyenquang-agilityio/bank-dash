// Libraries
import { Effect } from 'effect';

// Services
import { apiClient } from '@/services/api';
import { requestEffect } from '@/services/api.effect';

// Types
import type { MembersResponse } from '@/types/member';

// Constants
import { CACHE_TAGS, REVALIDATE } from '@/constants/cache';

export const getMembersEffect = (currentClerkId: string) => {
  const url = `/members?populate[0]=photo&populate[cards][populate]=*&filters[clerkId][$ne]=${currentClerkId}&pagination[pageSize]=100`;

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
        error: error.message || 'Failed to fetch members',
      }),
    ),
  );
};
