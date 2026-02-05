// Libraries
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Components
import { CardDetailsContent } from './CardDetailsContent';

// Types
import type { Card } from '@/types/card';

// Mock the updateCardDetails service
jest.mock('@/services/cards', () => ({
  updateCardDetails: jest.fn(),
}));

import { updateCardDetails } from '@/services/cards';

const mockUpdateCardDetails = updateCardDetails as jest.MockedFunction<typeof updateCardDetails>;

const mockCard: Card = {
  id: 1,
  documentId: 'card-123',
  number: '3778123456781234',
  name: 'Eddy Cusuma',
  expiration: '2025-12-01',
  balance: '$5,756',
  isActive: true,
  isPhysical: true,
  address: '123 Main St, New York, NY 10001',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

describe('CardDetailsContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders card holder name as heading', () => {
    render(<CardDetailsContent card={mockCard} />);

    expect(screen.getByRole('heading', { name: mockCard.name })).toBeInTheDocument();
  });

  it('renders card details correctly', () => {
    render(<CardDetailsContent card={mockCard} />);

    expect(screen.getByText('Card Type')).toBeInTheDocument();
    expect(screen.getByText('Physical')).toBeInTheDocument();
    expect(screen.getByText('Name On Card')).toBeInTheDocument();
    expect(screen.getByText('Expiration Date')).toBeInTheDocument();
    // Expiration date appears in both CreditCard and details grid
    expect(screen.getAllByText('12/25')).toHaveLength(2);
    expect(screen.getByText('Shipping Address')).toBeInTheDocument();
    expect(screen.getByText(mockCard.address!)).toBeInTheDocument();
  });

  it('shows masked card number with first and last 4 digits', () => {
    render(<CardDetailsContent card={mockCard} />);

    // maskCardNumber returns format: "3778 **** **** 1234"
    expect(screen.getAllByText('3778 **** **** 1234')).toHaveLength(2); // In CreditCard and details grid
  });

  it('displays Virtual for non-physical cards', () => {
    render(<CardDetailsContent card={{ ...mockCard, isPhysical: false }} />);

    expect(screen.getByText('Virtual')).toBeInTheDocument();
  });

  it('displays -- when address is not provided', () => {
    render(<CardDetailsContent card={{ ...mockCard, address: undefined }} />);

    expect(screen.getByText('--')).toBeInTheDocument();
  });

  it('shows Block Card option when card is active', () => {
    render(<CardDetailsContent card={mockCard} />);

    expect(screen.getByText('Block Card')).toBeInTheDocument();
    expect(screen.getByText('Instantly block your card')).toBeInTheDocument();
  });

  it('shows Unblock Card option when card is blocked', () => {
    render(<CardDetailsContent card={{ ...mockCard, isActive: false }} />);

    expect(screen.getByText('Unblock Card')).toBeInTheDocument();
    expect(screen.getByText('Reactivate your card')).toBeInTheDocument();
  });

  it('calls updateCardDetails when block option is clicked', async () => {
    mockUpdateCardDetails.mockResolvedValue({ success: true, card: null, error: null });

    render(<CardDetailsContent card={mockCard} />);

    const blockOption = screen.getByText('Block Card');
    fireEvent.click(blockOption);

    await waitFor(() => {
      expect(mockUpdateCardDetails).toHaveBeenCalledWith('card-123', { isActive: false });
    });
  });

  it('toggles to Unblock text after successful block', async () => {
    mockUpdateCardDetails.mockResolvedValue({ success: true, card: null, error: null });

    render(<CardDetailsContent card={mockCard} />);

    const blockOption = screen.getByText('Block Card');
    fireEvent.click(blockOption);

    await waitFor(() => {
      expect(screen.getByText('Unblock Card')).toBeInTheDocument();
    });
  });

  it('renders card settings section with all options', () => {
    render(<CardDetailsContent card={mockCard} />);

    expect(screen.getByText('Card Setting')).toBeInTheDocument();
    expect(screen.getByText('Change Pin Code')).toBeInTheDocument();
    expect(screen.getByText('Add to Google Pay')).toBeInTheDocument();
    expect(screen.getByText('Add to Apple Pay')).toBeInTheDocument();
    expect(screen.getByText('Add to Apple Store')).toBeInTheDocument();
  });
});
