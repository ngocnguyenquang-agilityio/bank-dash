import { render, screen } from '@testing-library/react';
import ServicesPage from './page';

describe('ServicesPage', () => {
  it('renders the placeholder page', () => {
    render(<ServicesPage />);
    expect(screen.getByText('Page not available')).toBeInTheDocument();
  });
});
