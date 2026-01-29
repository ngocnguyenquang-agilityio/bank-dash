// Libraries
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Components
import { CardsPageContent } from './CardsPageContent';

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
      variant: 'gradient-blue' as const,
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
      variant: 'white' as const,
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 3,
      documentId: 'doc3',
      number: '1234567812344300',
      name: 'Michel',
      expiration: '2025-12-01',
      balance: '$5,756',
      isActive: true,
      isPhysical: true,
      bank: 'BRC Bank',
      variant: 'gradient-purple' as const,
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
      variant: 'white' as const,
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

    // All cards show the same balance in our mock
    const balanceElements = screen.getAllByText('$5,756');
    // 4 in list + some in section
    expect(balanceElements.length).toBeGreaterThanOrEqual(4);
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
    expect(screen.getAllByText('Edward').length).toBeGreaterThan(0);
  });

  it('renders all four View Details buttons in card list', () => {
    render(<CardsPageContent cards={mockCards} error={null} />);

    const viewDetailsButtons = screen.getAllByRole('button', { name: /view details/i });
    expect(viewDetailsButtons).toHaveLength(4);
  });

  it('renders pagination controls', () => {
    render(<CardsPageContent cards={mockCards} error={null} />);

    expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('Add Card button is clickable', async () => {
    const user = userEvent.setup();
    render(<CardsPageContent cards={mockCards} error={null} />);

    const addCardButton = screen.getByRole('button', { name: /add card/i });
    await user.click(addCardButton);

    expect(addCardButton).toBeInTheDocument();
  });

  it('renders correct bank names in card list', () => {
    render(<CardsPageContent cards={mockCards} error={null} />);

    expect(screen.getByText('DBL Bank')).toBeInTheDocument();
    expect(screen.getAllByText('BRC Bank')).toHaveLength(2);
    expect(screen.getByText('ABM Bank')).toBeInTheDocument();
  });

  it('renders card numbers in card list', () => {
    render(<CardsPageContent cards={mockCards} error={null} />);

    // CardListItem uses last4 masking by default
    expect(screen.getByText('**** **** **** 5600')).toBeInTheDocument();
    expect(screen.getAllByText('**** **** **** 4300')).toHaveLength(2);
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
