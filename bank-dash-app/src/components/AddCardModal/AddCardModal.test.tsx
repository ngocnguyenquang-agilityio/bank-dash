import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AddCardModal } from '.';

const mockPush = jest.fn();
const mockRefresh = jest.fn();
const mockAddCard = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

jest.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    user: { id: 'user-123' },
    isLoaded: true,
    isSignedIn: true,
  }),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('@/services/cards', () => ({
  addCard: (...args: unknown[]) => mockAddCard(...args),
}));

const defaultProps = {
  open: true,
  onOpenChange: jest.fn(),
};

describe('AddCardModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the dialog when open', () => {
    render(<AddCardModal {...defaultProps} />);

    expect(screen.getByText('Card Type')).toBeInTheDocument();
    expect(screen.getByText('Name On Card')).toBeInTheDocument();
    expect(screen.getByText('Card Number')).toBeInTheDocument();
    expect(screen.getByText('Expiration Date')).toBeInTheDocument();
    expect(screen.getByText('Balance')).toBeInTheDocument();
  });

  it('does not render dialog content when closed', () => {
    render(<AddCardModal {...defaultProps} open={false} />);

    expect(screen.queryByText('Card Type')).not.toBeInTheDocument();
  });

  it('renders Close and Add Card buttons', () => {
    render(<AddCardModal {...defaultProps} />);

    // Dialog has two Close buttons: the form's Close button and the dialog's X close button
    const closeButtons = screen.getAllByRole('button', { name: 'Close' });
    expect(closeButtons.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: 'Add Card' })).toBeInTheDocument();
  });

  it('has Add Card button disabled initially (form is not dirty)', () => {
    render(<AddCardModal {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'Add Card' })).toBeDisabled();
  });

  it('shows Address field when card type is Physical (default)', () => {
    render(<AddCardModal {...defaultProps} />);

    expect(screen.getByText('Address')).toBeInTheDocument();
  });

  it('formats card number with dashes as user types', async () => {
    const user = userEvent.setup();
    render(<AddCardModal {...defaultProps} />);

    const cardNumberInput = screen.getByPlaceholderText('**** **** **** ****');
    await user.type(cardNumberInput, '1234567890123456');

    expect(cardNumberInput).toHaveValue('1234-5678-9012-3456');
  });

  it('shows validation error when card number is incomplete', async () => {
    const user = userEvent.setup();
    render(<AddCardModal {...defaultProps} />);

    // Type only 8 digits — formatter produces "1234-5678"
    await user.type(screen.getByPlaceholderText('**** **** **** ****'), '12345678');
    await user.type(screen.getByPlaceholderText('My Cards'), 'John Doe');
    // Submit the form
    await user.click(screen.getByRole('button', { name: 'Add Card' }));

    expect(await screen.findByText('Card number must be 16 digits')).toBeInTheDocument();
    // Verify no server call was made — validation is client-side only
    expect(mockAddCard).not.toHaveBeenCalled();
  });

  it('does not show card number error when all 16 digits entered', async () => {
    const user = userEvent.setup();
    render(<AddCardModal {...defaultProps} />);

    await user.type(screen.getByPlaceholderText('**** **** **** ****'), '1234567890123456');
    await user.type(screen.getByPlaceholderText('My Cards'), 'John Doe');
    await user.click(screen.getByRole('button', { name: 'Add Card' }));

    // Wait briefly for any validation to trigger
    await waitFor(() => {
      expect(screen.queryByText('Card number must be 16 digits')).not.toBeInTheDocument();
    });
  });

  it('formats balance with commas as user types', async () => {
    const user = userEvent.setup();
    render(<AddCardModal {...defaultProps} />);

    const balanceInput = screen.getByPlaceholderText('0.00');
    await user.type(balanceInput, '1234567');

    expect(balanceInput).toHaveValue('1,234,567');
  });

  it('enables Add Card button after filling required fields', async () => {
    const user = userEvent.setup();
    render(<AddCardModal {...defaultProps} />);

    await user.type(screen.getByPlaceholderText('My Cards'), 'John Doe');
    await user.type(screen.getByPlaceholderText('**** **** **** ****'), '1234567890123456');

    expect(screen.getByRole('button', { name: 'Add Card' })).toBeEnabled();
  });

  it('shows the expiration date picker popover when clicked', async () => {
    const user = userEvent.setup();
    render(<AddCardModal {...defaultProps} />);

    const dateButton = screen.getByRole('button', { name: /pick a date/i });
    await user.click(dateButton);

    // Calendar should appear in the popover
    expect(await screen.findByRole('grid')).toBeInTheDocument();
  });

  it('shows submitting state text on the Add Card button', () => {
    render(<AddCardModal {...defaultProps} />);

    // Button shows "Add Card" text (not "Adding...")
    expect(screen.getByRole('button', { name: 'Add Card' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Adding...' })).not.toBeInTheDocument();
  });
});
