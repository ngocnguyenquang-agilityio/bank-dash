import { render } from '@testing-library/react';
import { QuickTransferSkeleton } from './QuickTransferSkeleton';

describe('QuickTransferSkeleton', () => {
  it('renders skeleton with animation', () => {
    const { container } = render(<QuickTransferSkeleton />);

    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass('animate-pulse');
  });

  it('renders 3 avatar placeholders', () => {
    const { container } = render(<QuickTransferSkeleton />);

    const avatarCircles = container.querySelectorAll('.w-\\[70px\\].h-\\[70px\\].rounded-full');
    expect(avatarCircles).toHaveLength(3);
  });

  it('renders input section placeholder', () => {
    const { container } = render(<QuickTransferSkeleton />);

    const inputPlaceholder = container.querySelector(
      '.h-\\[50px\\].bg-neutral-20.rounded-\\[50px\\]',
    );
    expect(inputPlaceholder).toBeInTheDocument();
  });
});
