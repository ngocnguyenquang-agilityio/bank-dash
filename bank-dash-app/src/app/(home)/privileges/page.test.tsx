import { render, screen } from '@testing-library/react';
import PrivilegesPage from './page';

describe('PrivilegesPage', () => {
  it('renders the placeholder page', () => {
    render(<PrivilegesPage />);
    expect(screen.getByText('Page not available')).toBeInTheDocument();
  });
});
