import { render, screen } from '@testing-library/react';
import { DashboardHeaderContent } from './DashboardHeaderContent';

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

const defaultProps = {
  memberName: 'John Doe',
  memberInitials: 'JD',
  memberImageUrl: 'https://example.com/avatar.jpg',
};

describe('DashboardHeader', () => {
  it('renders the generated title based on pathname', () => {
    render(<DashboardHeaderContent {...defaultProps} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeInTheDocument();
  });

  it('renders search input with placeholder', () => {
    render(<DashboardHeaderContent {...defaultProps} />);
    // Present in the DOM even if visually hidden on small screens
    expect(screen.getByPlaceholderText('Search for something')).toBeInTheDocument();
  });

  it('has action buttons (settings and notifications)', () => {
    render(<DashboardHeaderContent {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Notifications' })).toBeInTheDocument();
  });

  it('shows the profile avatar image with alt text', () => {
    render(<DashboardHeaderContent {...defaultProps} />);
    expect(screen.getByAltText('John Doe')).toBeInTheDocument();
  });
});
