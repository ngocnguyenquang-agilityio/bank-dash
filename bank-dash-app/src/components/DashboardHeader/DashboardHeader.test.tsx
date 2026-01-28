import { render, screen } from '@testing-library/react';
import { DashboardHeader } from './DashboardHeader';

// Mock @clerk/nextjs to prevent ESM parsing issues
jest.mock('@clerk/nextjs', () => ({
  SignOutButton: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('DashboardHeader', () => {
  it('renders the provided title', () => {
    render(<DashboardHeader title="Accounts" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Accounts' })).toBeInTheDocument();
  });

  it('renders search input with placeholder', () => {
    render(<DashboardHeader title="Overview" />);
    // Present in the DOM even if visually hidden on small screens
    expect(screen.getByPlaceholderText('Search for something')).toBeInTheDocument();
  });

  it('has three action buttons (settings, notifications, and logout)', () => {
    render(<DashboardHeader title="Overview" />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(3);
  });

  it('shows the profile avatar image with alt text', () => {
    render(<DashboardHeader title="Overview" />);
    expect(screen.getByAltText('Profile')).toBeInTheDocument();
  });
});
