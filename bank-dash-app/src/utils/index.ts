import type { Metadata } from 'next';
import { getStrapiBaseUrl } from '@/lib/utils';

const SITE_NAME = 'BankDash';

export const getInitials = (name: string): string => {
  if (!name) return '';

  const words = name.trim().split(/\s+/);

  if (words.length === 1) {
    return (words[0]?.charAt(0) ?? '').toUpperCase();
  }

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
};

export const getStrapiMedia = (url: string | null | undefined) => {
  if (url == null || url === '') {
    return null;
  }

  // Return the full URL if the media is hosted on an external provider
  if (url.startsWith('http') || url.startsWith('//')) {
    return url;
  }

  const cleanBase = getStrapiBaseUrl();
  const cleanPath = url.replace(/^\/+/, '');

  return `${cleanBase}/${cleanPath}`;
};

export const createMetadata = (title: string, description?: string): Metadata => ({
  title: `${title} | ${SITE_NAME}`,
  description,
});
