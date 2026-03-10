import { render } from '@testing-library/react';
import CardsPageLoading from './loading';

describe('CardsPageLoading', () => {
  it('renders skeleton loading state', () => {
    const { container } = render(<CardsPageLoading />);
    expect(container.firstChild).toHaveClass('animate-pulse');
  });
});
