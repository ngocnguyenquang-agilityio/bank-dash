import { render } from '@testing-library/react';
import { RecentTransactionsSkeleton } from './RecentTransactionsSkeleton';

describe('RecentTransactionsSkeleton', () => {
  it('renders skeleton with animation', () => {
    const { container } = render(<RecentTransactionsSkeleton />);

    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass('animate-pulse');
  });

  it('renders 3 skeleton rows', () => {
    const { container } = render(<RecentTransactionsSkeleton />);

    const avatarCircles = container.querySelectorAll('.w-\\[55px\\].h-\\[55px\\].rounded-full');
    expect(avatarCircles).toHaveLength(3);
  });
});
