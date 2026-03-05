import { render, screen, fireEvent } from '@testing-library/react';
import { QuickTransfer } from './QuickTransfer';

import type { Member } from '@/types/member';

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

const mockMembersWithCards: Member[] = [
  {
    id: 1,
    documentId: 'member-1',
    clerkId: 'clerk-1',
    name: 'Alice Johnson',
    cards: [
      {
        id: 1,
        documentId: 'card-1',
        number: '1234567890123456',
        name: 'Alice Card',
        expiration: '2027-12',
        balance: '1000.00',
        isActive: true,
        isPhysical: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    ],
  },
  {
    id: 2,
    documentId: 'member-2',
    clerkId: 'clerk-2',
    name: 'Bob Smith',
    cards: [
      {
        id: 2,
        documentId: 'card-2',
        number: '6543210987654321',
        name: 'Bob Card',
        expiration: '2027-12',
        balance: '500.00',
        isActive: true,
        isPhysical: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    ],
  },
];

const mockMemberNoCards: Member = {
  id: 3,
  documentId: 'member-3',
  clerkId: 'clerk-3',
  name: 'Charlie Brown',
  cards: [],
};

const defaultProps = {
  userClerkId: 'test-user-123',
  senderName: 'Test User',
  members: mockMembersWithCards,
};

describe('QuickTransfer', () => {
  it('renders members, input label, and send button', () => {
    render(<QuickTransfer {...defaultProps} />);

    // Static label
    expect(screen.getByText('Write Amount')).toBeInTheDocument();

    // Placeholder present
    expect(screen.getByPlaceholderText('525.50')).toBeInTheDocument();

    // Send button
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();

    // Member names displayed
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.getByText('Bob Smith')).toBeInTheDocument();
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

  it('disables members without active cards', () => {
    const membersWithDisabled = [...mockMembersWithCards, mockMemberNoCards];

    render(<QuickTransfer {...defaultProps} members={membersWithDisabled} />);

    // Charlie Brown should be in the DOM but disabled
    const charlieButton = screen.getByText('Charlie Brown').closest('button');
    expect(charlieButton).toBeDisabled();
  });
});
