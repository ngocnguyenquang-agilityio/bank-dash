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

// Strapi accepts a numeric ID for media relations instead of the full object
type UpdateMemberData = Omit<Partial<MembersResponse['data'][0]>, 'photo'> & {
  photo?: number | null;
};

export const updateMember = async (
  documentId: string,
  data: UpdateMemberData,
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

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface UploadAvatarResult {
  success: boolean;
  error: string | null;
}

export const uploadAvatar = async (
  memberId: number,
  formData: FormData,
): Promise<UploadAvatarResult> => {
  const file = formData.get('file') as File | null;

  if (!file) {
    return { success: false, error: 'No file provided' };
  }

  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return {
      success: false,
      error: 'Invalid file type. Please upload a JPEG, PNG, or WebP image.',
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { success: false, error: 'File is too large. Maximum size is 5MB.' };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://127.0.0.1:1337';

  const uploadData = new FormData();
  uploadData.append('files', file);
  uploadData.append('ref', 'api::member.member');
  uploadData.append('refId', String(memberId));
  uploadData.append('field', 'photo');

  const effect = Effect.tryPromise({
    try: async () => {
      const response = await fetch(`${baseUrl}/api/upload`, {
        method: 'POST',
        body: uploadData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Upload failed');
      }

      return { success: true, error: null };
    },
    catch: (error) => ({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload avatar',
    }),
  }).pipe(Effect.catchAll((result) => Effect.succeed(result)));

  return runServerEffect(effect);
};
