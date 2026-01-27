import type { Meta, StoryObj } from "@storybook/nextjs";
import { BalanceHistory } from ".";

const meta: Meta<typeof BalanceHistory> = {
  title: "Dashboard/BalanceHistory",
  component: BalanceHistory,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof BalanceHistory>;

export const Default: Story = {
  render: () => (
    <div className="w-[480px] p-6 bg-neutral-10">
      <BalanceHistory />
    </div>
  ),
};
