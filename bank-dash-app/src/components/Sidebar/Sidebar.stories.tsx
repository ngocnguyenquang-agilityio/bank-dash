import type { Meta, StoryObj } from "@storybook/nextjs";
import { Sidebar } from ".";

const meta: Meta<typeof Sidebar> = {
  title: "Dashboard/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
    </div>
  ),
};
