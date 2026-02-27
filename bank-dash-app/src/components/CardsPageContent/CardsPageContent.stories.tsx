// Libraries
import type { Meta, StoryObj } from '@storybook/nextjs';

// Components
import { CardsPageContent } from '.';

// Types
import type { CardsResponse } from '@/types/card';

const mockCardsData: CardsResponse = {
  data: [
    {
      id: 1,
      documentId: 'card1',
      balance: '$5,756',
      name: 'Eddy Cusuma',
      number: '3778 **** **** 1234',
      expiration: '2022-12-01',
      isActive: true,
      isPhysical: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      documentId: 'card2',
      balance: '$8,234',
      name: 'Eddy Cusuma',
      number: '4532 **** **** 5678',
      expiration: '2024-06-01',
      isActive: true,
      isPhysical: false,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 3,
      documentId: 'card3',
      balance: '$3,120',
      name: 'Eddy Cusuma',
      number: '6011 **** **** 9012',
      expiration: '2025-09-01',
      isActive: true,
      isPhysical: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ],
  meta: {
    pagination: {
      page: 1,
      pageSize: 10,
      pageCount: 1,
      total: 3,
    },
  },
};

const meta: Meta<typeof CardsPageContent> = {
  title: 'Pages/CardsPageContent',
  component: CardsPageContent,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/cards',
        searchParams: {},
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof CardsPageContent>;

export const Default: Story = {
  args: {
    cards: mockCardsData,
    error: null,
  },
  render: (args) => (
    <div className="p-10 bg-background min-h-screen">
      <CardsPageContent {...args} />
    </div>
  ),
};

export const WithError: Story = {
  args: {
    cards: null,
    error: 'Failed to load cards. Please try again.',
  },
  render: (args) => (
    <div className="p-10 bg-background min-h-screen">
      <CardsPageContent {...args} />
    </div>
  ),
};

export const NoCards: Story = {
  args: {
    cards: {
      data: [],
      meta: {
        pagination: {
          page: 1,
          pageSize: 10,
          pageCount: 0,
          total: 0,
        },
      },
    },
    error: null,
  },
  render: (args) => (
    <div className="p-10 bg-background min-h-screen">
      <CardsPageContent {...args} />
    </div>
  ),
};

export const MobileView: Story = {
  args: {
    cards: mockCardsData,
    error: null,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: (args) => (
    <div className="p-4 bg-background min-h-screen">
      <CardsPageContent {...args} />
    </div>
  ),
};

export const TabletView: Story = {
  args: {
    cards: mockCardsData,
    error: null,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  render: (args) => (
    <div className="p-6 bg-background min-h-screen">
      <CardsPageContent {...args} />
    </div>
  ),
};
