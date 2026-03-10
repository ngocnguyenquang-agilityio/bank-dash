import { render } from '@testing-library/react';
import Loading from './loading';

describe('Loading', () => {
  it('renders skeleton loading state', () => {
    const { container } = render(<Loading />);
    expect(container.firstChild).toHaveClass('animate-pulse');
  });
});
