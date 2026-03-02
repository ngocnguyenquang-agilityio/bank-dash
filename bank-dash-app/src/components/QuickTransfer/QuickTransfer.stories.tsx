import type { Meta, StoryObj } from '@storybook/nextjs';
import { QuickTransfer } from '.';

const meta: Meta<typeof QuickTransfer> = {
  title: 'Dashboard/QuickTransfer',
  component: QuickTransfer,
  parameters: {
    layout: 'centered',
  },
  args: {
    userClerkId: 'test-user-123',
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
