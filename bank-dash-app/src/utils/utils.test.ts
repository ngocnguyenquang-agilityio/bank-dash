import { getInitials, getStrapiMedia, createMetadata } from './index';
import { parseBalanceToCents, centsToBalance, getStrapiBaseUrl, getApiBaseUrl } from '@/lib/utils';

// Store original env
const originalEnv = { ...process.env };

afterEach(() => {
  // Restore env after each test
  process.env = { ...originalEnv };
});

describe('getInitials', () => {
  it('returns empty string for empty name', () => {
    expect(getInitials('')).toBe('');
  });

  it('returns single initial for single word', () => {
    expect(getInitials('Alice')).toBe('A');
  });

  it('returns two initials for two words', () => {
    expect(getInitials('Alice Johnson')).toBe('AJ');
  });

  it('returns first two initials for more than two words', () => {
    expect(getInitials('John Michael Smith')).toBe('JM');
  });

  it('handles extra whitespace', () => {
    expect(getInitials('  Alice   Johnson  ')).toBe('AJ');
  });

  it('uppercases initials', () => {
    expect(getInitials('alice johnson')).toBe('AJ');
  });
});

describe('getStrapiMedia', () => {
  it('returns null for null input', () => {
    expect(getStrapiMedia(null)).toBeNull();
  });

  it('returns null for undefined input', () => {
    expect(getStrapiMedia(undefined)).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(getStrapiMedia('')).toBeNull();
  });

  it('returns full URL for http URLs', () => {
    expect(getStrapiMedia('http://example.com/image.png')).toBe('http://example.com/image.png');
  });

  it('returns full URL for https URLs', () => {
    expect(getStrapiMedia('https://example.com/image.png')).toBe('https://example.com/image.png');
  });

  it('returns full URL for protocol-relative URLs', () => {
    expect(getStrapiMedia('//example.com/image.png')).toBe('//example.com/image.png');
  });

  it('prepends base URL for relative paths', () => {
    process.env.NEXT_PUBLIC_BASE_URL = 'http://127.0.0.1:1337';
    expect(getStrapiMedia('/uploads/image.png')).toBe('http://127.0.0.1:1337/uploads/image.png');
  });

  it('handles relative path without leading slash', () => {
    process.env.NEXT_PUBLIC_BASE_URL = 'http://127.0.0.1:1337';
    expect(getStrapiMedia('uploads/image.png')).toBe('http://127.0.0.1:1337/uploads/image.png');
  });

  it('derives base URL from API URL when BASE_URL is not set', () => {
    delete process.env.NEXT_PUBLIC_BASE_URL;
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:1337/api';
    expect(getStrapiMedia('/uploads/image.png')).toBe('http://localhost:1337/uploads/image.png');
  });
});

describe('createMetadata', () => {
  it('creates metadata with title and description', () => {
    const metadata = createMetadata('Dashboard', 'View your dashboard');
    expect(metadata).toEqual({
      title: 'Dashboard | BankDash',
      description: 'View your dashboard',
    });
  });

  it('creates metadata without description', () => {
    const metadata = createMetadata('Settings');
    expect(metadata).toEqual({
      title: 'Settings | BankDash',
      description: undefined,
    });
  });
});

describe('getApiBaseUrl', () => {
  it('returns the API URL when set', () => {
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:1337/api';
    expect(getApiBaseUrl()).toBe('http://localhost:1337/api');
  });

  it('throws when NEXT_PUBLIC_API_URL is not set', () => {
    delete process.env.NEXT_PUBLIC_API_URL;
    expect(() => getApiBaseUrl()).toThrow('NEXT_PUBLIC_API_URL is not set');
  });
});

describe('getStrapiBaseUrl', () => {
  it('returns NEXT_PUBLIC_BASE_URL when set', () => {
    process.env.NEXT_PUBLIC_BASE_URL = 'http://my-strapi.com';
    expect(getStrapiBaseUrl()).toBe('http://my-strapi.com');
  });

  it('strips trailing slashes from NEXT_PUBLIC_BASE_URL', () => {
    process.env.NEXT_PUBLIC_BASE_URL = 'http://my-strapi.com///';
    expect(getStrapiBaseUrl()).toBe('http://my-strapi.com');
  });

  it('derives from API URL by stripping /api suffix', () => {
    delete process.env.NEXT_PUBLIC_BASE_URL;
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:1337/api';
    expect(getStrapiBaseUrl()).toBe('http://localhost:1337');
  });

  it('returns empty string when neither env var is set', () => {
    delete process.env.NEXT_PUBLIC_BASE_URL;
    delete process.env.NEXT_PUBLIC_API_URL;
    expect(getStrapiBaseUrl()).toBe('');
  });
});

describe('parseBalanceToCents', () => {
  it('parses plain numbers', () => {
    expect(parseBalanceToCents('100.00')).toBe(10000);
  });

  it('parses comma-formatted balances', () => {
    expect(parseBalanceToCents('5,432.10')).toBe(543210);
  });

  it('handles whole numbers without decimals', () => {
    expect(parseBalanceToCents('1000')).toBe(100000);
  });

  it('returns NaN for invalid input', () => {
    expect(parseBalanceToCents('abc')).toBeNaN();
  });

  it('handles zero', () => {
    expect(parseBalanceToCents('0.00')).toBe(0);
  });
});

describe('centsToBalance', () => {
  it('converts cents to balance string', () => {
    expect(centsToBalance(10000)).toBe('100.00');
  });

  it('handles zero', () => {
    expect(centsToBalance(0)).toBe('0.00');
  });

  it('handles small amounts', () => {
    expect(centsToBalance(1)).toBe('0.01');
  });

  it('handles large amounts', () => {
    expect(centsToBalance(999999)).toBe('9999.99');
  });
});
