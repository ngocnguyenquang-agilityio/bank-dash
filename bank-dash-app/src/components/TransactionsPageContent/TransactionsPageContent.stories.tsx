// Libraries
import type { Meta, StoryObj } from '@storybook/nextjs';

// Components
import { TransactionsPageContent } from '.';

// Types
import { Transactions } from '@/types/card';
import type { CardsResponse } from '@/types/card';
import type { TransactionsResponse } from '@/types/transaction';

const mockCards: CardsResponse = {
  data: [
    {
      id: 1,
      documentId: 'card-1',
      number: '3778123456785600',
      name: 'Eddy Cusuma',
      expiration: '2025-12-01',
      balance: '$5,756',
      isActive: true,
      isPhysical: true,
      address: '123 Main St, New York',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
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
    {
      id: 3,
      documentId: 'tx-3',
      message: 'Electricity Bill',
      amount: 85,
      type: Transactions.Withdrawal,
      createdAt: '2026-02-07T09:00:00Z',
      updatedAt: '2026-02-07T09:00:00Z',
    },
    {
      id: 4,
      documentId: 'tx-4',
      message: 'Freelance Payment',
      amount: 1200,
      type: Transactions.Deposit,
      createdAt: '2026-02-06T14:00:00Z',
      updatedAt: '2026-02-06T14:00:00Z',
    },
  ],
  meta: {
    pagination: { page: 1, pageSize: 10, pageCount: 3, total: 25 },
  },
};

const meta: Meta<typeof TransactionsPageContent> = {
  title: 'Pages/TransactionsPageContent',
  component: TransactionsPageContent,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/transactions',
        searchParams: {},
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof TransactionsPageContent>;

export const Default: Story = {
  args: {
    cards: mockCards,
    transactions: mockTransactions,
    error: null,
  },
  render: (args) => (
    <div className="p-10 bg-background min-h-screen">
      <TransactionsPageContent {...args} />
    </div>
  ),
};

export const NoCards: Story = {
  args: {
    cards: { data: [], meta: { pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 } } },
    transactions: mockTransactions,
    error: null,
  },
  render: (args) => (
    <div className="p-10 bg-background min-h-screen">
      <TransactionsPageContent {...args} />
    </div>
  ),
};

export const NoTransactions: Story = {
  args: {
    cards: mockCards,
    transactions: {
      data: [],
      meta: { pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 } },
    },
    error: null,
  },
  render: (args) => (
    <div className="p-10 bg-background min-h-screen">
      <TransactionsPageContent {...args} />
    </div>
  ),
};

export const WithError: Story = {
  args: {
    cards: null,
    transactions: null,
    error: 'Failed to load transactions. Please try again.',
  },
  render: (args) => (
    <div className="p-10 bg-background min-h-screen">
      <TransactionsPageContent {...args} />
    </div>
  ),
};

export const MobileView: Story = {
  args: {
    cards: mockCards,
    transactions: mockTransactions,
    error: null,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: (args) => (
    <div className="p-4 bg-background min-h-screen">
      <TransactionsPageContent {...args} />
    </div>
  ),
};
