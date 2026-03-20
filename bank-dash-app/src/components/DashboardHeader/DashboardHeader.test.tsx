import { render, screen } from '@testing-library/react';
import { DashboardHeaderContent } from './DashboardHeaderContent';
import { useMemberStore } from '@/stores/member';
import type { Member } from '@/types/member';

// Mock @clerk/nextjs to prevent ESM parsing issues
jest.mock('@clerk/nextjs', () => ({
  SignOutButton: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useClerk: () => ({ signOut: jest.fn() }),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/dashboard',
  useSearchParams: () => new URLSearchParams(),
}));

const mockMember: Member = {
  id: 1,
  documentId: 'doc123',
  clerkId: 'clerk123',
  name: 'John Doe',
  photo: {
    id: 1,
    documentId: 'photo123',
    url: 'https://example.com/avatar.jpg',
  },
};

beforeEach(() => {
  useMemberStore.setState({
    member: mockMember,
    memberName: 'John Doe',
    memberInitials: 'JD',
    memberImageUrl: 'https://example.com/avatar.jpg',
    updateMemberData: jest.fn(),
    hydrate: jest.fn(),
  });
});

describe('DashboardHeader', () => {
  it('renders the generated title based on pathname', () => {
    render(<DashboardHeaderContent />);
    expect(screen.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeInTheDocument();
  });

  it('renders search input with placeholder', () => {
    render(<DashboardHeaderContent />);
    // Present in the DOM even if visually hidden on small screens
    expect(screen.getByPlaceholderText('Search for something')).toBeInTheDocument();
  });

  it('has action buttons (settings and notifications)', () => {
    render(<DashboardHeaderContent />);
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Notifications' })).toBeInTheDocument();
  });

  it('shows the profile avatar image with alt text', () => {
    render(<DashboardHeaderContent />);
    expect(screen.getByAltText('John Doe')).toBeInTheDocument();
  });
});
