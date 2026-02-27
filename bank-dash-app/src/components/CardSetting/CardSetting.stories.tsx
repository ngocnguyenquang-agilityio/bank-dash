import type { Meta, StoryObj } from '@storybook/nextjs';
import { CardSetting } from '.';

const meta: Meta<typeof CardSetting> = {
  title: 'Components/CardSetting',
  component: CardSetting,
  parameters: {
    layout: 'centered',
  },
  args: {
    isActive: true,
    isPending: false,
    onToggleBlock: () => {},
  },
};

export default meta;

type Story = StoryObj<typeof CardSetting>;

export const ActiveCard: Story = {
  render: (args) => (
    <div className="p-10 bg-background max-w-md">
      <CardSetting {...args} />
    </div>
  ),
};

export const BlockedCard: Story = {
  args: {
    isActive: false,
  },
  render: (args) => (
    <div className="p-10 bg-background max-w-md">
      <CardSetting {...args} />
    </div>
  ),
};

export const Pending: Story = {
  args: {
    isPending: true,
  },
  render: (args) => (
    <div className="p-10 bg-background max-w-md">
      <CardSetting {...args} />
    </div>
  ),
};
