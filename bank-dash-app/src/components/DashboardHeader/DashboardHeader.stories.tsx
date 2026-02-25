import type { Meta, StoryObj } from '@storybook/nextjs';
import { DashboardHeaderContent } from './DashboardHeaderContent';

const meta: Meta<typeof DashboardHeaderContent> = {
  title: 'Dashboard/DashboardHeader',
  component: DashboardHeaderContent,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    memberName: 'John Doe',
    memberInitials: 'JD',
    memberImageUrl: 'https://i.pravatar.cc/150?u=john',
  },
};

export default meta;

type Story = StoryObj<typeof DashboardHeaderContent>;

export const Default: Story = {
  render: (args) => (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeaderContent {...args} />
    </div>
  ),
};
