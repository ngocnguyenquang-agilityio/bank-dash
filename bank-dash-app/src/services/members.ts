'use server';

// Libraries
import { Effect } from 'effect';

// Services
import { apiClient } from '@/services/api';
import { requestEffect } from '@/services/api.effect';

// Utils
import { runServerEffect } from '@/lib/effect/runtime';

// Types
import type { MembersResponse } from '@/types/member';

interface GetMemberResult {
  member: MembersResponse['data'][0] | null;
  error: string | null;
}

export const getMemberByClerkId = async (clerkId: string): Promise<GetMemberResult> => {
  const url = `/members?populate=*&filters[clerkId][$eq]=${clerkId}`;

  const effect = requestEffect(apiClient.get<MembersResponse>(url)).pipe(
    Effect.map((response) => ({
      member: response.data[0] || null,
      error: null,
    })),
    Effect.catchAll((error) =>
      Effect.succeed({
        member: null,
        error: error.message || 'Failed to fetch member',
      }),
    ),
  );

  return runServerEffect(effect);
};

interface UpdateMemberResult {
  success: boolean;
  error: string | null;
}

export const updateMember = async (
  documentId: string,
  data: Partial<MembersResponse['data'][0]>,
): Promise<UpdateMemberResult> => {
  const url = `/members/${documentId}`;

  const effect = requestEffect(
    apiClient.put<{ data: MembersResponse['data'][0] }>(url, {
      body: { data },
    }),
  ).pipe(
    Effect.map(() => ({ success: true, error: null })),
    Effect.catchAll((error) =>
      Effect.succeed({
        success: false,
        error: error.message || 'Failed to update member',
      }),
    ),
  );

  return runServerEffect(effect);
};
