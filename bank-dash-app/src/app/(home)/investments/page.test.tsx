import { render, screen } from '@testing-library/react';
import InvestmentsPage from './page';

describe('InvestmentsPage', () => {
  it('renders the placeholder page', () => {
    render(<InvestmentsPage />);
    expect(screen.getByText('Page not available')).toBeInTheDocument();
  });
});
