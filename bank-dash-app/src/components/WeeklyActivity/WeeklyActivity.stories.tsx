import type { Meta, StoryObj } from "@storybook/nextjs";
import { WeeklyActivity } from ".";

const meta: Meta<typeof WeeklyActivity> = {
  title: "Dashboard/WeeklyActivity",
  component: WeeklyActivity,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof WeeklyActivity>;

export const Default: Story = {
  render: () => (
    <div className="w-[720px] p-6 bg-neutral-10">
      <WeeklyActivity />
    </div>
  ),
};
