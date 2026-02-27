import type { Meta, StoryObj } from '@storybook/nextjs';
import { AvatarProfile } from '.';

const meta: Meta<typeof AvatarProfile> = {
  title: 'Dashboard/AvatarProfile',
  component: AvatarProfile,
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/dashboard',
        searchParams: {},
      },
    },
  },
  args: {
    imageUrl: 'https://i.pravatar.cc/150?u=avatar',
    fallback: 'EC',
    alt: 'Eddy Cusuma',
  },
};

export default meta;

type Story = StoryObj<typeof AvatarProfile>;

export const WithImage: Story = {
  render: (args) => (
    <div className="p-10 bg-background">
      <AvatarProfile {...args} />
    </div>
  ),
};

export const WithFallback: Story = {
  args: {
    imageUrl: '',
    fallback: 'JD',
    alt: 'John Doe',
  },
  render: (args) => (
    <div className="p-10 bg-background">
      <AvatarProfile {...args} />
    </div>
  ),
};
