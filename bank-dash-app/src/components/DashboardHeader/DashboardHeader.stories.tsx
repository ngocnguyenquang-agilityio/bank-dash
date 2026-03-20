import type { Meta, StoryObj } from '@storybook/nextjs';
import { DashboardHeaderContent } from './DashboardHeaderContent';
import { useMemberStore } from '@/stores/member';

const meta: Meta<typeof DashboardHeaderContent> = {
  title: 'Dashboard/DashboardHeader',
  component: DashboardHeaderContent,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/dashboard',
        searchParams: {},
      },
    },
  },
  decorators: [
    (Story) => {
      useMemberStore.setState({
        member: null,
        memberName: 'John Doe',
        memberInitials: 'JD',
        memberImageUrl: 'https://i.pravatar.cc/150?u=john',
      });
      return <Story />;
    },
  ],
};

export default meta;

type Story = StoryObj<typeof DashboardHeaderContent>;

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeaderContent />
    </div>
  ),
};
