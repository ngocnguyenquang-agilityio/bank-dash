// Libraries
import type { Meta, StoryObj } from '@storybook/nextjs';

// Components
import { CreditCard } from '.';

const meta: Meta<typeof CreditCard> = {
  title: 'Dashboard/CreditCard',
  component: CreditCard,
  parameters: {
    layout: 'centered',
  },
  args: {
    balance: '$5,756',
    cardHolder: 'Eddy Cusuma',
    cardNumber: '3778 **** **** 1234',
    expiration: '2022-12-01',
  },
};

export default meta;

type Story = StoryObj<typeof CreditCard>;

export const Default: Story = {
  render: (args) => (
    <div className="p-6 bg-neutral-10">
      <CreditCard {...args} />
    </div>
  ),
};

export const Blue: Story = {
  args: {
    variant: 'blue',
  },
  render: (args) => (
    <div className="p-6 bg-neutral-10">
      <CreditCard {...args} />
    </div>
  ),
};
