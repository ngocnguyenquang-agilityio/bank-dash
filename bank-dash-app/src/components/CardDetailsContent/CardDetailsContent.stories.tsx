// Libraries
import type { Meta, StoryObj } from '@storybook/nextjs';

// Components
import { CardDetailsContent } from './CardDetailsContent';

// Types
import type { Card } from '@/types/card';

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

const meta: Meta<typeof CardDetailsContent> = {
  title: 'Cards/CardDetailsContent',
  component: CardDetailsContent,
  parameters: {
    layout: 'padded',
  },
  args: {
    card: mockCard,
  },
};

export default meta;

type Story = StoryObj<typeof CardDetailsContent>;

export const ActivePhysicalCard: Story = {
  render: (args) => (
    <div className="p-6 bg-neutral-10 min-h-screen">
      <CardDetailsContent {...args} />
    </div>
  ),
};

export const BlockedCard: Story = {
  args: {
    card: {
      ...mockCard,
      isActive: false,
    },
  },
  render: (args) => (
    <div className="p-6 bg-neutral-10 min-h-screen">
      <CardDetailsContent {...args} />
    </div>
  ),
};

export const WithPageParam: Story = {
  args: {
    card: mockCard,
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        searchParams: { page: '3' },
      },
    },
  },
  render: (args) => (
    <div className="p-6 bg-neutral-10 min-h-screen">
      <CardDetailsContent {...args} />
    </div>
  ),
};

export const VirtualCard: Story = {
  args: {
    card: {
      ...mockCard,
      isPhysical: false,
      address: undefined,
    },
  },
  render: (args) => (
    <div className="p-6 bg-neutral-10 min-h-screen">
      <CardDetailsContent {...args} />
    </div>
  ),
};
