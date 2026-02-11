import type { Meta, StoryObj } from '@storybook/nextjs';
import { Icons } from '../Icons/Icons';
import { FeatureCard } from './FeatureCard';

const meta: Meta<typeof FeatureCard> = {
  title: 'Components/FeatureCard',
  component: FeatureCard,
  tags: ['autodocs'],
  argTypes: {
    icon: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof FeatureCard>;

export const Default: Story = {
  args: {
    icon: <Icons.CreditCard className="w-8 h-8 text-blue-60" />,
    title: 'Card Management',
    description: 'Manage multiple cards, view details, and track spending limits with ease.',
  },
};
