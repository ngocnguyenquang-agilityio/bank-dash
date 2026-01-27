import type { Meta, StoryObj } from "@storybook/nextjs";
import { RecentTransactions } from ".";

const meta: Meta<typeof RecentTransactions> = {
  title: "Dashboard/RecentTransactions",
  component: RecentTransactions,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof RecentTransactions>;

export const Default: Story = {
  render: () => (
    <div className="p-6 bg-neutral-10 w-[400px]">
      <RecentTransactions />
    </div>
  ),
};
