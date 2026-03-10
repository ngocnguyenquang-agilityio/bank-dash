import { render } from '@testing-library/react';
import CardDetailLoading from './loading';

describe('CardDetailLoading', () => {
  it('renders skeleton loading state', () => {
    const { container } = render(<CardDetailLoading />);
    expect(container.firstChild).toHaveClass('animate-pulse');
  });
});
