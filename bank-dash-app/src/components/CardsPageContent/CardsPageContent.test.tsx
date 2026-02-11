// Libraries
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Types
import type { CreditCardProps } from '@/components/CreditCard';
import type { CardListItemProps } from '@/components/CardListItem';
import type { PaginationProps } from '@/components/Pagination';

const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  useSearchParams: () => ({
    get: jest.fn().mockReturnValue('1'),
    toString: jest.fn().mockReturnValue(''),
  }),
}));

jest.mock('@/components/CreditCard', () => ({
  CreditCard: ({ balance, cardHolder }: CreditCardProps) => (
    <div data-testid="credit-card">
      <span>{balance}</span>
      <span>{cardHolder}</span>
    </div>
  ),
}));

jest.mock('@/components/CardListItem', () => ({
  CardListItem: ({ nameOnCard, cardNumber, isPhysical }: CardListItemProps) => {
    // Basic masking for the test expectation
    const last4 = cardNumber.slice(-4);
    const masked = `**** **** **** ${last4}`;
    return (
      <div data-testid="card-list-item">
        <span>{nameOnCard}</span>
        <span>{masked}</span>
        <span>{isPhysical ? 'Physical' : 'Virtual'}</span>
        <button>View Details</button>
      </div>
    );
  },
}));

jest.mock('@/components/Pagination', () => ({
  Pagination: ({ onPageChange, page, pageCount }: PaginationProps) => (
    <div data-testid="pagination">
      <button aria-label="Previous" disabled={page === 1}>
        Previous
      </button>
      <button
        aria-label="Next"
        onClick={() => onPageChange?.(page + 1)}
        disabled={page === pageCount}
      >
        Next
      </button>
    </div>
  ),
}));

jest.mock('@/components/AddCardModal', () => ({
  AddCardModal: ({
    open,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onOpenChange: _onOpenChange,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }) => (open ? <div data-testid="add-card-modal">Add Card Modal</div> : null),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

// Components
import { CardsPageContent } from './CardsPageContent';

beforeEach(() => {
  jest.clearAllMocks();
});

const mockCards = {
  data: [
    {
      id: 1,
      documentId: 'doc1',
      number: '1234567812345600',
      name: 'William',
      expiration: '2025-12-01',
      balance: '$5,756',
      isActive: true,
      isPhysical: true,
      bank: 'DBL Bank',
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 2,
      documentId: 'doc2',
      number: '1234567812344300',
      name: 'Michel',
      expiration: '2025-12-01',
      balance: '$5,756',
      isActive: true,
      isPhysical: false,
      bank: 'BRC Bank',
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 3,
      documentId: 'doc3',
      number: '1234567812345678',
      name: 'Sarah',
      expiration: '2025-12-01',
      balance: '$5,756',
      isActive: true,
      isPhysical: true,
      bank: 'BRC Bank',
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 4,
      documentId: 'doc4',
      number: '1234567812347560',
      name: 'Edward',
      expiration: '2025-12-01',
      balance: '$5,756',
      isActive: true,
      isPhysical: false,
      bank: 'ABM Bank',
      createdAt: '',
      updatedAt: '',
    },
  ],
  meta: {
    pagination: {
      page: 1,
      pageSize: 4,
      pageCount: 1,
      total: 4,
    },
  },
};

describe('CardsPageContent', () => {
  it('renders My Cards section heading', () => {
    render(<CardsPageContent cards={mockCards} error={null} />);

    expect(screen.getByText('My Cards')).toBeInTheDocument();
  });

  it('renders Add Card button', () => {
    render(<CardsPageContent cards={mockCards} error={null} />);

    const addCardButton = screen.getByRole('button', { name: /add card/i });
    expect(addCardButton).toBeInTheDocument();
  });

  it('renders credit cards in My Cards section', () => {
    render(<CardsPageContent cards={mockCards} error={null} />);

    // Only first 3 cards are shown in My Cards section
    const creditCards = screen.getAllByTestId('credit-card');
    expect(creditCards.length).toBe(3);
  });

  it('renders Card List section heading', () => {
    render(<CardsPageContent cards={mockCards} error={null} />);

    expect(screen.getByText('Card List')).toBeInTheDocument();
  });

  it('renders four card list items', () => {
    render(<CardsPageContent cards={mockCards} error={null} />);

    // Check for specific card names (they appear in both sections now)
    expect(screen.getAllByText('William').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Michel').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Sarah').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Edward').length).toBeGreaterThan(0);
  });

  it('renders all four View Details buttons in card list', () => {
    render(<CardsPageContent cards={mockCards} error={null} />);
    const viewDetailsButtons = screen.getAllByRole('button', { name: /view details/i });
    expect(viewDetailsButtons).toHaveLength(4);
  });

  it('renders pagination controls', () => {
    render(<CardsPageContent cards={mockCards} error={null} />);

    expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });

  it('handles page change', async () => {
    const user = userEvent.setup();

    const multiPageMock = {
      ...mockCards,
      data: [
        ...mockCards.data,
        {
          id: 5,
          documentId: 'doc5',
          number: '1234567812349999',
          name: 'John',
          expiration: '2025-12-01',
          balance: '$6,000',
          isActive: true,
          isPhysical: true,
          bank: 'XYZ Bank',
          createdAt: '',
          updatedAt: '',
        },
      ],
      meta: {
        pagination: {
          ...mockCards.meta.pagination,
          pageCount: 2,
          total: 5,
        },
      },
    };

    render(<CardsPageContent cards={multiPageMock} error={null} />);

    const nextButton = screen.getByRole('button', { name: 'Next' });
    expect(nextButton).not.toBeDisabled();

    await user.click(nextButton);
    expect(pushMock).toHaveBeenCalledWith(expect.stringContaining('page=2'));
  });

  it('Add Card button is clickable', async () => {
    const user = userEvent.setup();
    render(<CardsPageContent cards={mockCards} error={null} />);

    const addCardButton = screen.getByRole('button', { name: /add card/i });
    await user.click(addCardButton);

    expect(addCardButton).toBeInTheDocument();
  });

  it('renders card numbers in card list', () => {
    render(<CardsPageContent cards={mockCards} error={null} />);
    // CardListItem uses last4 masking by default
    expect(screen.getByText('**** **** **** 5600')).toBeInTheDocument();
    expect(screen.getByText('**** **** **** 4300')).toBeInTheDocument();
    expect(screen.getByText('**** **** **** 5678')).toBeInTheDocument();
    expect(screen.getByText('**** **** **** 7560')).toBeInTheDocument();
  });

  it('renders card types correctly', () => {
    render(<CardsPageContent cards={mockCards} error={null} />);

    const physicalElements = screen.getAllByText('Physical');
    const virtualElements = screen.getAllByText('Virtual');
    expect(physicalElements).toHaveLength(2);
    expect(virtualElements).toHaveLength(2);
  });
});
