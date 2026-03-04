'use server';

// Libraries
import { Effect } from 'effect';
import { updateTag } from 'next/cache';

// Services
import { apiClient } from '@/services/api';
import { ApiRequestError, requestEffect } from '@/services/api.effect';
import { getCardsEffect } from '@/services/cards.effect';

// Utils
import { runServerEffect } from '@/lib/effect/runtime';

// Types
import type { CardsResponse, CardFormData, Card } from '@/types/card';
import type { MembersResponse } from '@/types/member';

// Constants
import { CARD_ERRORS, NOT_FOUND_ERRORS } from '@/constants/error';
import { CACHE_TAGS, REVALIDATE } from '@/constants/cache';

type ServiceResult<T extends Record<string, unknown> = Record<string, never>> = {
  error: string | null;
} & T;

export const getCards = async (
  userClerkId: string,
  page: number = 1,
  pageSize: number = 5,
): Promise<ServiceResult<{ cards: CardsResponse | null }>> => {
  return runServerEffect(getCardsEffect(userClerkId, page, pageSize));
};

export const addCard = async (
  userId: string,
  cardData: CardFormData,
): Promise<ServiceResult<{ success: boolean }>> => {
  const memberUrl = `/members?populate=*&filters[clerkId][$eq]=${userId}`;

  const effect = requestEffect(apiClient.get<MembersResponse>(memberUrl)).pipe(
    Effect.flatMap((response) => {
      const member = response.data[0];

      if (!member) {
        return Effect.fail(new ApiRequestError({ message: NOT_FOUND_ERRORS.MEMBER_NOT_FOUND }));
      }

      const payload = {
        number: cardData.cardNumber,
        name: cardData.nameOnCard,
        expiration: cardData.expiration,
        isPhysical: cardData.isPhysical,
        address: cardData.address,
        balance: cardData.balance,
        member: member.documentId,
      };

      return requestEffect(
        apiClient.post('/cards', {
          body: { data: payload },
        }),
      );
    }),
    Effect.map(() => {
      updateTag(CACHE_TAGS.CARDS);
      return { success: true, error: null };
    }),
    Effect.catchAll((error) =>
      Effect.succeed({
        success: false,
        error: error.message || CARD_ERRORS.ADD_CARD_FAILED,
      }),
    ),
  );

  return runServerEffect(effect);
};

export const getCardDetails = async (
  documentId: string,
): Promise<ServiceResult<{ card: Card | null }>> => {
  const url = `/cards/${documentId}?populate=*`;

  const effect = requestEffect(
    apiClient.get<{ data: Card }>(url, {
      next: {
        revalidate: REVALIDATE.CARD_DETAIL,
        tags: [CACHE_TAGS.CARDS, CACHE_TAGS.CARD_DETAIL(documentId)],
      },
    }),
  ).pipe(
    Effect.map((response) => ({ card: response.data, error: null })),
    Effect.catchAll((error) =>
      Effect.succeed({
        card: null,
        error: error.message || CARD_ERRORS.GET_CARD_FAILED,
      }),
    ),
  );

  return runServerEffect(effect);
};

export const updateCardDetails = async (
  documentId: string,
  cardData: Partial<CardFormData>,
): Promise<ServiceResult<{ success: boolean; card: Card | null }>> => {
  const url = `/cards/${documentId}`;

  // Map form fields to API field names
  const fieldMapping: Record<string, string> = {
    cardNumber: 'number',
    nameOnCard: 'name',
    expiration: 'expiration',
    isPhysical: 'isPhysical',
    isActive: 'isActive',
    address: 'address',
  };

  const payload = Object.entries(cardData).reduce(
    (acc, [key, value]) => {
      if (value !== undefined && fieldMapping[key]) {
        acc[fieldMapping[key]] = value;
      }
      return acc;
    },
    {} as Record<string, unknown>,
  );

  const effect = requestEffect(
    apiClient.put<{ data: Card }>(url, {
      body: { data: payload },
    }),
  ).pipe(
    Effect.map((response) => {
      updateTag(CACHE_TAGS.CARDS);
      updateTag(CACHE_TAGS.CARD_DETAIL(documentId));
      return { success: true, card: response.data, error: null };
    }),
    Effect.catchAll((error) =>
      Effect.succeed({
        success: false,
        card: null,
        error: error.message || CARD_ERRORS.UPDATE_CARD_FAILED,
      }),
    ),
  );

  return runServerEffect(effect);
};

export const updateCardBalance = async (
  documentId: string,
  newBalance: string,
): Promise<ServiceResult<{ success: boolean }>> => {
  const url = `/cards/${documentId}`;

  const effect = requestEffect(
    apiClient.put<{ data: Card }>(url, {
      body: { data: { balance: newBalance } },
    }),
  ).pipe(
    Effect.map(() => {
      updateTag(CACHE_TAGS.CARDS);
      updateTag(CACHE_TAGS.CARD_DETAIL(documentId));
      return { success: true, error: null };
    }),
    Effect.catchAll((error) =>
      Effect.succeed({
        success: false,
        error: error.message || CARD_ERRORS.UPDATE_CARD_FAILED,
      }),
    ),
  );

  return runServerEffect(effect);
};
