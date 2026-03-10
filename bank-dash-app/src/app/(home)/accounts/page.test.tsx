import { render, screen } from '@testing-library/react';
import AccountsPage from './page';

describe('AccountsPage', () => {
  it('renders the placeholder page', () => {
    render(<AccountsPage />);
    expect(screen.getByText('Page not available')).toBeInTheDocument();
    expect(screen.getByText('Back to Dashboard')).toBeInTheDocument();
  });
});
