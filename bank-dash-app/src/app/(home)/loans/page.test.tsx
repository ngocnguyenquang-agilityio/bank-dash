import { render, screen } from '@testing-library/react';
import LoansPage from './page';

describe('LoansPage', () => {
  it('renders the placeholder page', () => {
    render(<LoansPage />);
    expect(screen.getByText('Page not available')).toBeInTheDocument();
  });
});
