'use server';

// Libraries
import { Effect } from 'effect';
import { updateTag } from 'next/cache';

// Services
import { apiClient } from '@/services/api';
import { requestEffect } from '@/services/api.effect';
import { getMembersEffect } from '@/services/members.effect';

// Utils
import { runServerEffect } from '@/lib/effect/runtime';

// Types
import type { MembersResponse } from '@/types/member';

// Constants
import { CACHE_TAGS, REVALIDATE } from '@/constants/cache';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/constants/upload';
import { MEMBER_ERRORS } from '@/constants/error';

interface GetMemberResult {
  member: MembersResponse['data'][0] | null;
  error: string | null;
}

export const getMemberByClerkId = async (clerkId: string): Promise<GetMemberResult> => {
  const url = `/members?populate=*&filters[clerkId][$eq]=${clerkId}`;

  const effect = requestEffect(
    apiClient.get<MembersResponse>(url, {
      next: {
        revalidate: REVALIDATE.MEMBERS,
        tags: [CACHE_TAGS.MEMBERS, CACHE_TAGS.MEMBER(clerkId)],
      },
    }),
  ).pipe(
    Effect.map((response) => ({
      member: response.data[0] || null,
      error: null,
    })),
    Effect.catchAll((error) =>
      Effect.succeed({
        member: null,
        error: error.message || MEMBER_ERRORS.GET_MEMBER_FAILED,
      }),
    ),
    Effect.withSpan('getMemberByClerkId', {
      attributes: { clerkId },
    }),
  );

  return runServerEffect(effect);
};

interface GetMembersResult {
  members: MembersResponse | null;
  error: string | null;
}

export const getMembers = async (currentClerkId: string): Promise<GetMembersResult> => {
  return runServerEffect(getMembersEffect(currentClerkId));
};

interface UpdateMemberResult {
  success: boolean;
  member: MembersResponse['data'][0] | null;
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
  const url = `/members/${documentId}?populate=*`;

  const effect = requestEffect(
    apiClient.put<{ data: MembersResponse['data'][0] }>(url, {
      body: { data },
    }),
  ).pipe(
    Effect.map((response) => {
      updateTag(CACHE_TAGS.MEMBERS);
      return { success: true, member: response.data, error: null };
    }),
    Effect.catchAll((error) =>
      Effect.succeed({
        success: false,
        member: null,
        error: error.message || MEMBER_ERRORS.UPDATE_MEMBER_FAILED,
      }),
    ),
    Effect.withSpan('updateMember', {
      attributes: { documentId, data: JSON.stringify(data) },
    }),
  );

  return runServerEffect(effect);
};

interface UploadAvatarResult {
  success: boolean;
  fileId: number | null;
  error: string | null;
}

export const uploadAvatar = async (formData: FormData): Promise<UploadAvatarResult> => {
  const file = formData.get('file') as File | null;

  if (!file) {
    return { success: false, fileId: null, error: MEMBER_ERRORS.NO_FILE_PROVIDED };
  }

  if (!ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_TYPES)[number])) {
    return {
      success: false,
      fileId: null,
      error: MEMBER_ERRORS.INVALID_FILE_TYPE,
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { success: false, fileId: null, error: MEMBER_ERRORS.FILE_TOO_LARGE };
  }

  const uploadData = new FormData();
  uploadData.append('files', file);

  const effect = requestEffect(
    apiClient.postFormData<Array<{ id: number }>>('/upload', uploadData),
  ).pipe(
    Effect.map((result) => {
      const uploaded = Array.isArray(result) ? result[0] : result;
      return { success: true, fileId: uploaded?.id ?? null, error: null };
    }),
    Effect.catchAll((error) =>
      Effect.succeed({
        success: false,
        fileId: null,
        error: error.message || MEMBER_ERRORS.UPLOAD_AVATAR_FAILED,
      }),
    ),
    Effect.withSpan('uploadAvatar'),
  );

  return runServerEffect(effect);
};
