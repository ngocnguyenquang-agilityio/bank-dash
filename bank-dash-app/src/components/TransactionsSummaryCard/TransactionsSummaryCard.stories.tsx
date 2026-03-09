// Libraries
import type { Meta, StoryObj } from '@storybook/nextjs';

// Components
import { TransactionsSummaryCard } from '.';
import { Icons } from '@/components/Icons/Icons';

const meta: Meta<typeof TransactionsSummaryCard> = {
  title: 'Transactions/TransactionsSummaryCard',
  component: TransactionsSummaryCard,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof TransactionsSummaryCard>;

export const MyBalance: Story = {
  args: {
    icon: <Icons.MoneyTag className="fill-[#FFBB38]" />,
    iconBg: '#FFF5D9',
    label: 'My Balance',
    value: '$12,750',
  },
};

export const Income: Story = {
  args: {
    icon: <Icons.Invest className="fill-[#396AFF]" />,
    iconBg: '#E7EDFF',
    label: 'Income',
    value: '$5,600',
  },
};

export const Expense: Story = {
  args: {
    icon: <Icons.MedicalRecipe className="fill-[#FF82AC]" />,
    iconBg: '#FFE0EB',
    label: 'Expense',
    value: '$3,460',
  },
};

export const TotalSaving: Story = {
  args: {
    icon: <Icons.Saving className="fill-[#16DBCC]" />,
    iconBg: '#DCFAF8',
    label: 'Total Saving',
    value: '$7,920',
  },
};

export const AllCards: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      <TransactionsSummaryCard
        icon={<Icons.MoneyTag className="fill-[#FFBB38]" />}
        iconBg="#FFF5D9"
        label="My Balance"
        value="$12,750"
      />
      <TransactionsSummaryCard
        icon={<Icons.Invest className="fill-[#396AFF]" />}
        iconBg="#E7EDFF"
        label="Income"
        value="$5,600"
      />
      <TransactionsSummaryCard
        icon={<Icons.MedicalRecipe className="fill-[#FF82AC]" />}
        iconBg="#FFE0EB"
        label="Expense"
        value="$3,460"
      />
      <TransactionsSummaryCard
        icon={<Icons.Saving className="fill-[#16DBCC]" />}
        iconBg="#DCFAF8"
        label="Total Saving"
        value="$7,920"
      />
    </div>
  ),
};
