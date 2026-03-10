import { render } from '@testing-library/react';
import TransactionsLoading from './loading';

describe('TransactionsLoading', () => {
  it('renders skeleton loading state', () => {
    const { container } = render(<TransactionsLoading />);
    expect(container.firstChild).toHaveClass('animate-pulse');
  });
});
