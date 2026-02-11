// Libraries
import { render, screen } from '@testing-library/react';

// Components
import { RecentTransactions } from './RecentTransactions';

// Types
import { Transactions } from '@/types/card';
import type { TransactionsResponse } from '@/types/transaction';

const mockTransactions: TransactionsResponse = {
  data: [
    {
      id: 1,
      documentId: 'tx-1',
      message: 'Deposit from my Card',
      amount: 850,
      type: Transactions.Withdrawal,
      createdAt: '2021-01-28T10:00:00Z',
      updatedAt: '2021-01-28T10:00:00Z',
    },
    {
      id: 2,
      documentId: 'tx-2',
      message: 'Deposit Paypal',
      amount: 2500,
      type: Transactions.Deposit,
      createdAt: '2021-01-25T10:00:00Z',
      updatedAt: '2021-01-25T10:00:00Z',
    },
    {
      id: 3,
      documentId: 'tx-3',
      message: 'Jemi Wilson',
      amount: 5400,
      type: Transactions.Deposit,
      createdAt: '2021-01-21T10:00:00Z',
      updatedAt: '2021-01-21T10:00:00Z',
    },
  ],
  meta: {
    pagination: {
      page: 1,
      pageSize: 3,
      pageCount: 1,
      total: 3,
    },
  },
};

describe('RecentTransactions', () => {
  it('renders a list of transactions with titles, dates, and amounts', () => {
    render(<RecentTransactions transactions={mockTransactions} />);

    // Titles
    expect(screen.getByText('Deposit from my Card')).toBeInTheDocument();
    expect(screen.getByText('Deposit Paypal')).toBeInTheDocument();
    expect(screen.getByText('Jemi Wilson')).toBeInTheDocument();

    // Dates (formatted by the component)
    expect(screen.getByText('January 28, 2021')).toBeInTheDocument();
    expect(screen.getByText('January 25, 2021')).toBeInTheDocument();
    expect(screen.getByText('January 21, 2021')).toBeInTheDocument();

    // Amounts (+/- formatting)
    expect(screen.getByText('-$850')).toBeInTheDocument();
    expect(screen.getByText('+$2,500')).toBeInTheDocument();
    expect(screen.getByText('+$5,400')).toBeInTheDocument();
  });

  it('shows empty state when no transactions', () => {
    render(<RecentTransactions transactions={null} />);
    expect(screen.getByText('No recent transactions')).toBeInTheDocument();
  });
});
