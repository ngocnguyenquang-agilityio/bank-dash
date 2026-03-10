import { render, screen } from '@testing-library/react';
import NotFound from './not-found';

describe('NotFound', () => {
  it('renders the not found page', () => {
    render(<NotFound />);
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByText('Back to Dashboard')).toBeInTheDocument();
  });

  it('has a link back to dashboard', () => {
    render(<NotFound />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/dashboard');
  });
});
