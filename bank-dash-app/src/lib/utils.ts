// Libraries
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type MaskOption = 'last4' | 'firstAndLast4';

export function maskCardNumber(cardNumber: string, option: MaskOption = 'firstAndLast4') {
  const last4 = cardNumber.slice(-4);
  if (option === 'last4') {
    return `**** **** **** ${last4}`;
  }
  const first4 = cardNumber.slice(0, 4);
  return `${first4} **** **** ${last4}`;
}

/**
 * Returns the Strapi API base URL.
 */
export function getApiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    throw new Error('NEXT_PUBLIC_API_URL is not set. Add it to your .env.local file.');
  }
  return url;
}

/**
 * Returns the Strapi media base URL (non-API, for images/uploads).
 * Falls back to the API URL origin when NEXT_PUBLIC_BASE_URL is not set.
 */
export function getStrapiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL.replace(/\/+$/, '');
  }
  // Derive from the API URL by stripping the /api suffix
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
  return apiUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');
}

/**
 * Parse a balance string into cents
 */
export function parseBalanceToCents(balance: string | number): number {
  const cleaned = String(balance).replace(/,/g, '');
  const parsed = Number(cleaned);
  if (!Number.isFinite(parsed)) return NaN;
  return Math.round(parsed * 100);
}

/**
 * Convert cents back to a balance string with two decimal places.
 */
export function centsToBalance(cents: number): string {
  return (cents / 100).toFixed(2);
}
