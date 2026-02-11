// Libraries
import type { Meta, StoryObj } from '@storybook/nextjs';

// Components
import { RecentTransactions } from '.';

// Types
import { Transactions } from '@/types/card';
import type { TransactionsResponse } from '@/types/transaction';

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
    {
      id: 3,
      documentId: 'tx-3',
      message: 'Electricity Bill',
      amount: 85,
      type: Transactions.Withdrawal,
      createdAt: '2026-02-07T09:00:00Z',
      updatedAt: '2026-02-07T09:00:00Z',
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

const meta: Meta<typeof RecentTransactions> = {
  title: 'Dashboard/RecentTransactions',
  component: RecentTransactions,
  parameters: {
    layout: 'centered',
  },
  args: {
    transactions: mockTransactions,
  },
};

export default meta;

type Story = StoryObj<typeof RecentTransactions>;

export const Default: Story = {
  render: (args) => (
    <div className="p-6 bg-neutral-10 w-[400px]">
      <RecentTransactions {...args} />
    </div>
  ),
};

export const Empty: Story = {
  args: {
    transactions: null,
  },
  render: (args) => (
    <div className="p-6 bg-neutral-10 w-[400px]">
      <RecentTransactions {...args} />
    </div>
  ),
};
