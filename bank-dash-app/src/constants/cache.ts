// Cache tag constants for Next.js fetch cache invalidation
export const CACHE_TAGS = {
  CARDS: 'cards',
  CARD_DETAIL: (documentId: string) => `card-${documentId}`,
  CARDS_USER: (clerkId: string) => `cards-user-${clerkId}`,
  TRANSACTIONS: 'transactions',
  TRANSACTIONS_USER: (clerkId: string) => `transactions-user-${clerkId}`,
  MEMBERS: 'members',
  MEMBER: (clerkId: string) => `member-${clerkId}`,
} as const;

// Revalidation intervals in seconds
export const REVALIDATE = {
  CARDS: 300, // 5 min — cards change only via user actions
  CARD_DETAIL: 300, // 5 min
  TRANSACTIONS: 60, // 1 min — more time-sensitive
  MEMBERS: 600, // 10 min — profile data rarely changes
} as const;
