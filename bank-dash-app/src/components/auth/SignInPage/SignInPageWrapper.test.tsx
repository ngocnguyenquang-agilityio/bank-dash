import { render, screen } from '@testing-library/react';
import { SignInPageWrapper } from './SignInPageWrapper';

jest.mock('@clerk/nextjs', () => ({
  SignIn: ({
    signUpUrl,
    fallbackRedirectUrl,
  }: {
    signUpUrl: string;
    fallbackRedirectUrl: string;
  }) => (
    <div
      data-testid="clerk-sign-in"
      data-sign-up-url={signUpUrl}
      data-redirect={fallbackRedirectUrl}
    >
      Mock SignIn
    </div>
  ),
  useAuth: () => ({
    isSignedIn: false,
    isLoaded: true,
    signOut: jest.fn(),
  }),
}));

jest.mock('@/components/CreditCard', () => ({
  CreditCard: () => <div data-testid="credit-card">Mock CreditCard</div>,
}));

describe('SignInPageWrapper', () => {
  it('renders the branding text', () => {
    render(<SignInPageWrapper />);

    expect(screen.getAllByText('BankDash.').length).toBeGreaterThan(0);
    expect(screen.getByText(/Manage your finances/)).toBeInTheDocument();
    expect(screen.getByText(/with confidence/)).toBeInTheDocument();
  });

  it('renders the Clerk SignIn component', () => {
    render(<SignInPageWrapper />);

    const signIn = screen.getByTestId('clerk-sign-in');
    expect(signIn).toBeInTheDocument();
    expect(signIn).toHaveAttribute('data-sign-up-url', '/sign-up');
    expect(signIn).toHaveAttribute('data-redirect', '/dashboard');
  });

  it('renders the decorative credit card', () => {
    render(<SignInPageWrapper />);

    expect(screen.getByTestId('credit-card')).toBeInTheDocument();
  });

  it('renders links to home page', () => {
    render(<SignInPageWrapper />);

    const links = screen.getAllByRole('link');
    const homeLinks = links.filter((link) => link.getAttribute('href') === '/');
    expect(homeLinks.length).toBeGreaterThan(0);
  });
});
