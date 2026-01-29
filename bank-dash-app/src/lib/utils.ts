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
