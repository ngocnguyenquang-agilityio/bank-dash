// Libraries
import type { Meta, StoryObj } from '@storybook/nextjs';

// Components
import { CardListItem } from '.';

const meta: Meta<typeof CardListItem> = {
  title: 'Dashboard/CardListItem',
  component: CardListItem,
  parameters: {
    layout: 'centered',
  },
  args: {
    isPhysical: false,
    cardNumber: '**** **** 5600',
    nameOnCard: 'William',
    address: '123 Main St, New York',
  },
};

export default meta;

type Story = StoryObj<typeof CardListItem>;

export const Blue: Story = {
  render: (args) => (
    <div className="p-6 bg-neutral-10 w-[1120px]">
      <CardListItem {...args} />
    </div>
  ),
};

export const Pink: Story = {
  args: {
    isPhysical: false,
    cardNumber: '**** **** 4300',
    nameOnCard: 'Michel',
    address: '456 Oak Ave, Los Angeles',
  },
  render: (args) => (
    <div className="p-6 bg-neutral-10 w-[1120px]">
      <CardListItem {...args} />
    </div>
  ),
};

export const Yellow: Story = {
  args: {
    isPhysical: true,
    cardNumber: '**** **** 7560',
    nameOnCard: 'Edward',
    address: '789 Pine Rd, Chicago',
  },
  render: (args) => (
    <div className="p-6 bg-neutral-10 w-[1120px]">
      <CardListItem {...args} />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="p-6 bg-neutral-10 w-[1120px] space-y-5">
      <CardListItem
        id="1"
        isPhysical={false}
        cardNumber="**** **** 5600"
        nameOnCard="William"
        address="123 Main St, New York"
      />
      <CardListItem
        id="2"
        isPhysical={false}
        cardNumber="**** **** 4300"
        nameOnCard="Michel"
        address="456 Oak Ave, Los Angeles"
      />
      <CardListItem
        id="3"
        isPhysical={true}
        cardNumber="**** **** 7560"
        nameOnCard="Edward"
        address="789 Pine Rd, Chicago"
      />
    </div>
  ),
};
