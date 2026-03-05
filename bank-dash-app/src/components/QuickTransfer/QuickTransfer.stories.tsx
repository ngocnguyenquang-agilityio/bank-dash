import type { Meta, StoryObj } from '@storybook/nextjs';
import { QuickTransfer } from '.';

import type { Member } from '@/types/member';

const mockMembers: Member[] = [
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
  {
    id: 3,
    documentId: 'member-3',
    clerkId: 'clerk-3',
    name: 'Charlie Brown',
    cards: [],
  },
];

const meta: Meta<typeof QuickTransfer> = {
  title: 'Dashboard/QuickTransfer',
  component: QuickTransfer,
  parameters: {
    layout: 'centered',
  },
  args: {
    userClerkId: 'test-user-123',
    senderName: 'Test User',
    members: mockMembers,
  },
};

export default meta;

type Story = StoryObj<typeof QuickTransfer>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[520px] p-6 bg-neutral-10">
      <QuickTransfer {...args} />
    </div>
  ),
};
