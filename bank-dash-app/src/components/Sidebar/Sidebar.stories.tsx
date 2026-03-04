import type { Meta, StoryObj } from '@storybook/nextjs';
import { Sidebar } from '.';

const meta: Meta<typeof Sidebar> = {
  title: 'Dashboard/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/dashboard',
      },
    },
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

export const ActiveCards: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/cards',
      },
    },
  },
  render: () => (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
    </div>
  ),
};
