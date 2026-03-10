import { render } from '@testing-library/react';
import { Toaster } from './sonner';

jest.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light' }),
}));

jest.mock('sonner', () => ({
  Toaster: ({ theme, className }: { theme: string; className: string }) => (
    <div data-testid="sonner-toaster" data-theme={theme} className={className}>
      Mock Toaster
    </div>
  ),
}));

describe('Toaster', () => {
  it('renders the sonner toaster', () => {
    const { getByTestId } = render(<Toaster />);

    const toaster = getByTestId('sonner-toaster');
    expect(toaster).toBeInTheDocument();
    expect(toaster).toHaveAttribute('data-theme', 'light');
  });

  it('applies the toaster group className', () => {
    const { getByTestId } = render(<Toaster />);

    expect(getByTestId('sonner-toaster')).toHaveClass('toaster', 'group');
  });
});
