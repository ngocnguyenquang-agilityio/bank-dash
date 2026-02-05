'use server';

// Libraries
import { Effect } from 'effect';

// Services
import { apiClient } from '@/services/api';
import { requestEffect } from '@/services/api.effect';
import { getMemberByClerkId } from '@/services/members';

// Utils
import { runServerEffect } from '@/lib/effect/runtime';

// Types
import type { CardsResponse, CardFormData, Card } from '@/types/card';

type ServiceResult<T extends Record<string, unknown> = Record<string, never>> = {
  error: string | null;
} & T;

export const getCards = async (
  userClerkId: string,
  page: number = 1,
  pageSize: number = 5
): Promise<ServiceResult<{ cards: CardsResponse | null }>> => {
  const url = `/cards?populate=*&filters[member][clerkId][$eq]=${userClerkId}&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;

  const effect = requestEffect(apiClient.get<CardsResponse>(url)).pipe(
    Effect.map((cards) => ({ cards, error: null })),
    Effect.catchAll((error) =>
      Effect.succeed({
        cards: null,
        error: error.message || 'Failed to fetch cards',
      })
    )
  );

  return runServerEffect(effect);
};

export const addCard = async (
  userId: string,
  cardData: CardFormData
): Promise<ServiceResult<{ success: boolean }>> => {
  const { member, error } = await getMemberByClerkId(userId);

  if (error || !member) {
    return {
      success: false,
      error: error || 'Member not found',
    };
  }

  const payload = {
    number: cardData.cardNumber,
    name: cardData.nameOnCard,
    expiration: cardData.expiration,
    isPhysical: cardData.isPhysical,
    address: cardData.address,
    member: member.documentId,
  };

  const effect = requestEffect(
    apiClient.post('/cards', {
      body: { data: payload },
    })
  ).pipe(
    Effect.map(() => ({ success: true, error: null })),
    Effect.catchAll((error) =>
      Effect.succeed({
        success: false,
        error: error.message || 'Failed to add card',
      })
    )
  );

  return runServerEffect(effect);
};

export const getCardDetails = async (
  documentId: string
): Promise<ServiceResult<{ card: Card | null }>> => {
  const url = `/cards/${documentId}?populate=*`;

  const effect = requestEffect(apiClient.get<{ data: Card }>(url)).pipe(
    Effect.map((response) => ({ card: response.data, error: null })),
    Effect.catchAll((error) =>
      Effect.succeed({
        card: null,
        error: error.message || 'Failed to fetch card details',
      })
    )
  );

  return runServerEffect(effect);
};

export const updateCardDetails = async (
  documentId: string,
  cardData: Partial<CardFormData>
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
    {} as Record<string, unknown>
  );

  const effect = requestEffect(
    apiClient.put<{ data: Card }>(url, {
      body: { data: payload },
    })
  ).pipe(
    Effect.map((response) => ({ success: true, card: response.data, error: null })),
    Effect.catchAll((error) =>
      Effect.succeed({
        success: false,
        card: null,
        error: error.message || 'Failed to update card details',
      })
    )
  );

  return runServerEffect(effect);
};
