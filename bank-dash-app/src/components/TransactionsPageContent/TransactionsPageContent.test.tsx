// Libraries
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Types
import type { PaginationProps } from '@/components/Pagination';

const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn().mockReturnValue(null),
    toString: jest.fn().mockReturnValue(''),
  }),
}));

jest.mock('@/components/TransactionsSummaryCard', () => ({
  TransactionsSummaryCard: ({ label, value }: { label: string; value: string }) => (
    <div data-testid="summary-card">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  ),
}));

jest.mock('@/components/RecentTransactions', () => ({
  RecentTransactions: () => <div data-testid="recent-transactions" />,
}));

jest.mock('@/components/CreditCard', () => ({
  CreditCard: ({ cardHolder }: { cardHolder: string }) => (
    <div data-testid="credit-card">{cardHolder}</div>
  ),
}));

jest.mock('@/components/Pagination', () => ({
  Pagination: ({ onPageChange, page, pageCount }: PaginationProps) => (
    <div data-testid="pagination">
      <button aria-label="Previous" disabled={page === 1} onClick={() => onPageChange?.(page - 1)}>
        Previous
      </button>
      <button
        aria-label="Next"
        disabled={page === pageCount}
        onClick={() => onPageChange?.(page + 1)}
      >
        Next
      </button>
    </div>
  ),
}));

// Components — imported after mocks
import { TransactionsPageContent } from './TransactionsPageContent';

// Types
import { Transactions } from '@/types/card';
import type { CardsResponse } from '@/types/card';
import type { TransactionsResponse } from '@/types/transaction';

const mockCards: CardsResponse = {
  data: [
    {
      id: 1,
      documentId: 'card-1',
      number: '1234567812345678',
      name: 'Eddy Cusuma',
      expiration: '2025-12-01',
      balance: '$5,756',
      isActive: true,
      isPhysical: true,
      createdAt: '',
      updatedAt: '',
    },
  ],
  meta: {
    pagination: { page: 1, pageSize: 10, pageCount: 1, total: 1 },
  },
};

const mockTransactions: TransactionsResponse = {
  data: [
    {
      id: 1,
      documentId: 'tx-1',
      message: 'Monthly Salary',
      amount: 5000,
      type: Transactions.Deposit,
      createdAt: '2026-02-09T10:00:00Z',
      updatedAt: '2026-02-09T10:00:00Z',
    },
    {
      id: 2,
      documentId: 'tx-2',
      message: 'Grocery Shopping',
      amount: 150,
      type: Transactions.Withdrawal,
      createdAt: '2026-02-08T15:30:00Z',
      updatedAt: '2026-02-08T15:30:00Z',
    },
  ],
  meta: {
    pagination: { page: 1, pageSize: 10, pageCount: 2, total: 12 },
  },
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TransactionsPageContent', () => {
  it('renders all four summary cards with correct labels and values', () => {
    render(
      <TransactionsPageContent cards={mockCards} transactions={mockTransactions} error={null} />,
    );

    const summaryCards = screen.getAllByTestId('summary-card');
    expect(summaryCards).toHaveLength(4);

    expect(screen.getByText('My Balance')).toBeInTheDocument();
    expect(screen.getByText('$12,750')).toBeInTheDocument();
    expect(screen.getByText('Income')).toBeInTheDocument();
    expect(screen.getByText('$5,600')).toBeInTheDocument();
    expect(screen.getByText('Expense')).toBeInTheDocument();
    expect(screen.getByText('$3,460')).toBeInTheDocument();
    expect(screen.getByText('Total Saving')).toBeInTheDocument();
    expect(screen.getByText('$7,920')).toBeInTheDocument();
  });

  it('renders the Last Transaction section heading', () => {
    render(
      <TransactionsPageContent cards={mockCards} transactions={mockTransactions} error={null} />,
    );

    expect(screen.getByText('Last Transaction')).toBeInTheDocument();
  });

  it('renders RecentTransactions component', () => {
    render(
      <TransactionsPageContent cards={mockCards} transactions={mockTransactions} error={null} />,
    );

    expect(screen.getByTestId('recent-transactions')).toBeInTheDocument();
  });

  it('renders Pagination component', () => {
    render(
      <TransactionsPageContent cards={mockCards} transactions={mockTransactions} error={null} />,
    );

    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  it('renders My Card section heading', () => {
    render(
      <TransactionsPageContent cards={mockCards} transactions={mockTransactions} error={null} />,
    );

    expect(screen.getByText('My Card')).toBeInTheDocument();
  });

  it('renders the credit card when cards are provided', () => {
    render(
      <TransactionsPageContent cards={mockCards} transactions={mockTransactions} error={null} />,
    );

    expect(screen.getByTestId('credit-card')).toBeInTheDocument();
    expect(screen.getByText('Eddy Cusuma')).toBeInTheDocument();
  });

  it('renders See All link when cards are present', () => {
    render(
      <TransactionsPageContent cards={mockCards} transactions={mockTransactions} error={null} />,
    );

    expect(screen.getByRole('link', { name: 'See All' })).toBeInTheDocument();
  });

  it('shows empty card state when no cards', () => {
    const emptyCards: CardsResponse = {
      data: [],
      meta: { pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 } },
    };

    render(
      <TransactionsPageContent cards={emptyCards} transactions={mockTransactions} error={null} />,
    );

    expect(screen.getByText('No cards yet')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Add your first card' })).toBeInTheDocument();
  });

  it('does not render See All link when no cards', () => {
    const emptyCards: CardsResponse = {
      data: [],
      meta: { pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 } },
    };

    render(
      <TransactionsPageContent cards={emptyCards} transactions={mockTransactions} error={null} />,
    );

    expect(screen.queryByRole('link', { name: 'See All' })).not.toBeInTheDocument();
  });

  it('renders error state when error is provided', () => {
    render(
      <TransactionsPageContent
        cards={null}
        transactions={null}
        error="Failed to load transactions"
      />,
    );

    expect(screen.getByText('Failed to load transactions')).toBeInTheDocument();
    expect(screen.queryByTestId('summary-card')).not.toBeInTheDocument();
  });

  it('navigates to next page on pagination click', async () => {
    const user = userEvent.setup();

    render(
      <TransactionsPageContent cards={mockCards} transactions={mockTransactions} error={null} />,
    );

    const nextButton = screen.getByRole('button', { name: 'Next' });
    expect(nextButton).not.toBeDisabled();

    await user.click(nextButton);
    expect(pushMock).toHaveBeenCalledWith(expect.stringContaining('page=2'));
  });

  it('previous button is disabled on first page', () => {
    render(
      <TransactionsPageContent cards={mockCards} transactions={mockTransactions} error={null} />,
    );

    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
  });
});
