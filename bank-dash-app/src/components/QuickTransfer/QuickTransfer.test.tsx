import { render, screen, fireEvent } from '@testing-library/react';
import { QuickTransfer } from './QuickTransfer';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}));

// Mock the sendAmount service
jest.mock('@/services/transfers', () => ({
  sendAmount: jest.fn(),
}));

const defaultProps = {
  userClerkId: 'test-user-123',
};

describe('QuickTransfer', () => {
  it('renders contacts, input label, and send button', () => {
    render(<QuickTransfer {...defaultProps} />);

    // Static label
    expect(screen.getByText('Write Amount')).toBeInTheDocument();

    // Placeholder present
    expect(screen.getByPlaceholderText('525.50')).toBeInTheDocument();

    // Send button
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('shows error when amount is invalid', async () => {
    render(<QuickTransfer {...defaultProps} />);

    const input = screen.getByPlaceholderText('525.50');
    const sendButton = screen.getByRole('button', { name: /send/i });

    // Enter invalid amount
    fireEvent.change(input, { target: { value: 'abc' } });
    fireEvent.click(sendButton);

    // Should show error
    expect(screen.getByText('Please enter a valid amount')).toBeInTheDocument();
  });

  it('shows error when amount is negative', async () => {
    render(<QuickTransfer {...defaultProps} />);

    const input = screen.getByPlaceholderText('525.50');
    const sendButton = screen.getByRole('button', { name: /send/i });

    // Enter negative amount
    fireEvent.change(input, { target: { value: '-100' } });
    fireEvent.click(sendButton);

    // Should show error
    expect(screen.getByText('Please enter a valid amount')).toBeInTheDocument();
  });
});
