import { CACHE_TAGS, REVALIDATE } from './cache';

describe('CACHE_TAGS', () => {
  it('has correct static tags', () => {
    expect(CACHE_TAGS.CARDS).toBe('cards');
    expect(CACHE_TAGS.TRANSACTIONS).toBe('transactions');
    expect(CACHE_TAGS.MEMBERS).toBe('members');
  });

  it('generates correct dynamic tags', () => {
    expect(CACHE_TAGS.CARD_DETAIL('doc-123')).toBe('card-doc-123');
    expect(CACHE_TAGS.CARDS_USER('clerk-456')).toBe('cards-user-clerk-456');
    expect(CACHE_TAGS.TRANSACTIONS_USER('clerk-789')).toBe('transactions-user-clerk-789');
    expect(CACHE_TAGS.MEMBER('clerk-abc')).toBe('member-clerk-abc');
  });
});

describe('REVALIDATE', () => {
  it('has correct revalidation intervals', () => {
    expect(REVALIDATE.CARDS).toBe(300);
    expect(REVALIDATE.CARD_DETAIL).toBe(300);
    expect(REVALIDATE.TRANSACTIONS).toBe(60);
    expect(REVALIDATE.MEMBERS).toBe(600);
  });
});
