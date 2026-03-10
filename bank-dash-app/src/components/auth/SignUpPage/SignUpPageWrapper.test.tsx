import { render, screen } from '@testing-library/react';
import { SignUpPageWrapper } from './SignUpPageWrapper';

jest.mock('@clerk/nextjs', () => ({
  SignUp: ({ signInUrl }: { signInUrl: string }) => (
    <div data-testid="clerk-sign-up" data-sign-in-url={signInUrl}>
      Mock SignUp
    </div>
  ),
}));

jest.mock('@/components/CreditCard', () => ({
  CreditCard: () => <div data-testid="credit-card">Mock CreditCard</div>,
}));

describe('SignUpPageWrapper', () => {
  it('renders the branding text', () => {
    render(<SignUpPageWrapper />);

    expect(screen.getAllByText('BankDash.').length).toBeGreaterThan(0);
    expect(screen.getByText(/Start your journey/)).toBeInTheDocument();
    expect(screen.getByText(/to smarter banking/)).toBeInTheDocument();
  });

  it('renders the Clerk SignUp component', () => {
    render(<SignUpPageWrapper />);

    const signUp = screen.getByTestId('clerk-sign-up');
    expect(signUp).toBeInTheDocument();
    expect(signUp).toHaveAttribute('data-sign-in-url', '/sign-in');
  });

  it('renders the decorative credit card', () => {
    render(<SignUpPageWrapper />);

    expect(screen.getByTestId('credit-card')).toBeInTheDocument();
  });

  it('renders links to home page', () => {
    render(<SignUpPageWrapper />);

    const links = screen.getAllByRole('link');
    const homeLinks = links.filter((link) => link.getAttribute('href') === '/');
    expect(homeLinks.length).toBeGreaterThan(0);
  });
});
