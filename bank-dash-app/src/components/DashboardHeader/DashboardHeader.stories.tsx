import type { Meta, StoryObj } from "@storybook/nextjs";
import { DashboardHeader } from ".";

const meta: Meta<typeof DashboardHeader> = {
  title: "Dashboard/DashboardHeader",
  component: DashboardHeader,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    title: "Overview",
  },
};

export default meta;

type Story = StoryObj<typeof DashboardHeader>;

export const Default: Story = {
  render: (args) => (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader {...args} />
    </div>
  ),
};
