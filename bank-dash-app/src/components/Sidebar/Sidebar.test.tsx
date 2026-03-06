// Libraries
import { usePathname } from 'next/navigation';
import { render, screen, fireEvent } from '@testing-library/react';

// Components
import { Sidebar } from './Sidebar';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

const enabledItems = ['Dashboard', 'Transactions', 'Cards', 'Setting'];
const disabledItems = ['Accounts', 'Investments', 'Loans', 'Services', 'My Privileges'];

describe('Sidebar', () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/dashboard');
  });

  it('renders the brand and all navigation items', () => {
    render(<Sidebar />);

    expect(screen.getByText('BankDash.')).toBeInTheDocument();

    [...enabledItems, ...disabledItems].forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('renders enabled items as links', () => {
    render(<Sidebar />);

    enabledItems.forEach((label) => {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument();
    });
  });

  it('renders disabled items as non-clickable spans with disabled styling', () => {
    render(<Sidebar />);

    disabledItems.forEach((label) => {
      // Should NOT be a link
      expect(screen.queryByRole('link', { name: label })).not.toBeInTheDocument();

      // Should be rendered as text with disabled styling
      const element = screen.getByText(label).closest('span[class]');
      expect(element).toBeInTheDocument();
      expect(element?.className).toContain('opacity-50');
      expect(element?.className).toContain('cursor-not-allowed');
    });
  });

  it("marks 'Dashboard' as the active link when on dashboard route", () => {
    render(<Sidebar />);

    const dashboardLink = screen.getByRole('link', { name: 'Dashboard' });
    expect(dashboardLink.className).toContain('text-blue-30');

    const cardsLink = screen.getByRole('link', { name: 'Cards' });
    expect(cardsLink.className).not.toContain('text-blue-30');
  });

  it('toggles the mobile menu open/close and closes on link click', () => {
    render(<Sidebar />);

    // The <aside> element should be present and initially translated off-screen on mobile
    const sidebar = screen.getByRole('complementary');
    expect(sidebar.className).toContain('-translate-x-full');

    // Toggle open via the hamburger button
    const toggleButton = screen.getByRole('button', { name: 'Open menu' });
    fireEvent.click(toggleButton);
    expect(sidebar.className).toContain('translate-x-0');
    expect(sidebar.className).not.toContain('-translate-x-full');

    // Clicking a nav link should close the menu again
    const cardsLink = screen.getByRole('link', { name: 'Cards' });
    fireEvent.click(cardsLink);

    // After closing, expect off-screen class back
    expect(sidebar.className).toContain('-translate-x-full');
  });
});
