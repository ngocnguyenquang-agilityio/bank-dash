import { render, screen, fireEvent } from '@testing-library/react';
import { HomePageWrapper } from './HomePageWrapper';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('HomePageWrapper', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders the navbar with logo and sign in button', () => {
    render(<HomePageWrapper />);

    expect(screen.getAllByText('Bank Dash').length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('renders the hero section', () => {
    render(<HomePageWrapper />);

    expect(screen.getByText(/Smart Banking for the/)).toBeInTheDocument();
    expect(screen.getByText('Modern Era')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /get started now/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /learn more/i })).toBeInTheDocument();
  });

  it('renders feature cards', () => {
    render(<HomePageWrapper />);

    expect(screen.getByText('Card Management')).toBeInTheDocument();
    expect(screen.getByText('Quick Transfers')).toBeInTheDocument();
    expect(screen.getByText('History & Analytics')).toBeInTheDocument();
  });

  it('renders the footer', () => {
    render(<HomePageWrapper />);

    expect(screen.getByText(/All rights reserved/)).toBeInTheDocument();
  });

  it('navigates to sign-in on Sign In button click', () => {
    render(<HomePageWrapper />);

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(mockPush).toHaveBeenCalledWith('/sign-in');
  });

  it('navigates to sign-in on Get Started Now button click', () => {
    render(<HomePageWrapper />);

    fireEvent.click(screen.getByRole('button', { name: /get started now/i }));
    expect(mockPush).toHaveBeenCalledWith('/sign-in');
  });
});
