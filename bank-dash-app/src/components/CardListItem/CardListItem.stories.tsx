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
    bank: 'DBL Bank',
    cardNumber: '**** **** 5600',
    nameOnCard: 'William',
    gradientColor: 'blue',
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
    bank: 'BRC Bank',
    cardNumber: '**** **** 4300',
    nameOnCard: 'Michel',
    gradientColor: 'pink',
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
    bank: 'ABM Bank',
    cardNumber: '**** **** 7560',
    nameOnCard: 'Edward',
    gradientColor: 'yellow',
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
        isPhysical={false}
        bank="DBL Bank"
        cardNumber="**** **** 5600"
        nameOnCard="William"
        gradientColor="blue"
      />
      <CardListItem
        isPhysical={false}
        bank="BRC Bank"
        cardNumber="**** **** 4300"
        nameOnCard="Michel"
        gradientColor="pink"
      />
      <CardListItem
        isPhysical={true}
        bank="ABM Bank"
        cardNumber="**** **** 7560"
        nameOnCard="Edward"
        gradientColor="yellow"
      />
    </div>
  ),
};
