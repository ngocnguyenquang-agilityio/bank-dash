import { render } from '@testing-library/react';
import { MyCardsSkeleton } from './MyCardsSkeleton';

describe('MyCardsSkeleton', () => {
  it('renders skeleton with animation', () => {
    const { container } = render(<MyCardsSkeleton />);
    expect(container.firstChild).toHaveClass('animate-pulse');
  });

  it('renders 2 card placeholders', () => {
    const { container } = render(<MyCardsSkeleton />);
    const cards = container.querySelectorAll('.w-\\[350px\\].h-\\[235px\\]');
    expect(cards).toHaveLength(2);
  });
});
