// Libraries
import { usePathname } from 'next/navigation';
import { render, screen, fireEvent } from '@testing-library/react';

// Components
import { Sidebar } from './Sidebar';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('Sidebar', () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/dashboard');
  });

  it('renders the brand and all main navigation items', () => {
    render(<Sidebar />);

    // Brand
    expect(screen.getByText('BankDash.')).toBeInTheDocument();

    // Primary items (spot check a few + ensure total count)
    const items = [
      'Dashboard',
      'Transactions',
      'Accounts',
      'Investments',
      'Cards',
      'Loans',
      'Services',
      'My Privileges',
      'Setting',
    ];

    items.forEach((label) => {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument();
    });
  });

  it("marks 'Dashboard' as the active link when on dashboard route", () => {
    render(<Sidebar />);

    const dashboardLink = screen.getByRole('link', { name: 'Dashboard' });
    expect(dashboardLink.className).toContain('text-blue-30');

    const transactionsLink = screen.getByRole('link', { name: 'Transactions' });
    expect(transactionsLink.className).not.toContain('text-blue-30');
  });

  it('toggles the mobile menu open/close and closes on link click', () => {
    render(<Sidebar />);

    // The <aside> element should be present and initially translated off-screen on mobile
    const sidebar = screen.getByRole('complementary');
    expect(sidebar.className).toContain('-translate-x-full');

    // Toggle open via the button (only button in component)
    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);
    expect(sidebar.className).toContain('translate-x-0');
    expect(sidebar.className).not.toContain('-translate-x-full');

    // Clicking a nav link should close the menu again
    const transactionsLink = screen.getByRole('link', { name: 'Transactions' });
    fireEvent.click(transactionsLink);

    // After closing, expect off-screen class back
    expect(sidebar.className).toContain('-translate-x-full');
  });
});
