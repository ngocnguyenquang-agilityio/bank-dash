import { getInitials, getStrapiMedia, createMetadata } from './index';

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
    expect(getStrapiMedia('/uploads/image.png')).toBe('http://127.0.0.1:1337/uploads/image.png');
  });

  it('handles relative path without leading slash', () => {
    expect(getStrapiMedia('uploads/image.png')).toBe('http://127.0.0.1:1337/uploads/image.png');
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
