import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CardSetting } from '.';

const defaultProps = {
  isActive: true,
  isPending: false,
  onToggleBlock: jest.fn(),
};

describe('CardSetting', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all setting items', () => {
    render(<CardSetting {...defaultProps} />);

    expect(screen.getByText('Block Card')).toBeInTheDocument();
    expect(screen.getByText('Change Pin Code')).toBeInTheDocument();
    expect(screen.getByText('Add to Google Pay')).toBeInTheDocument();
    expect(screen.getByText('Add to Apple Pay')).toBeInTheDocument();
    expect(screen.getByText('Add to Apple Store')).toBeInTheDocument();
  });

  it('shows "Block Card" when card is active', () => {
    render(<CardSetting {...defaultProps} isActive />);

    expect(screen.getByText('Block Card')).toBeInTheDocument();
    expect(screen.getByText('Instantly block your card')).toBeInTheDocument();
  });

  it('shows "Unblock Card" when card is inactive', () => {
    render(<CardSetting {...defaultProps} isActive={false} />);

    expect(screen.getByText('Unblock Card')).toBeInTheDocument();
    expect(screen.getByText('Reactivate your card')).toBeInTheDocument();
  });

  it('shows "Processing..." when pending', () => {
    render(<CardSetting {...defaultProps} isPending />);

    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });

  it('calls onToggleBlock when block/unblock is clicked', async () => {
    const user = userEvent.setup();
    render(<CardSetting {...defaultProps} />);

    await user.click(screen.getByText('Block Card'));

    expect(defaultProps.onToggleBlock).toHaveBeenCalledTimes(1);
  });

  it('does not call onToggleBlock when pending', async () => {
    const user = userEvent.setup();
    render(<CardSetting {...defaultProps} isPending />);

    await user.click(screen.getByText('Block Card'));

    expect(defaultProps.onToggleBlock).not.toHaveBeenCalled();
  });
});
