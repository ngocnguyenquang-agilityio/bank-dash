// Libraries
import type { Meta, StoryObj } from '@storybook/nextjs';

// Components
import { SettingPageContent } from '.';

const meta: Meta<typeof SettingPageContent> = {
  title: 'Pages/SettingPageContent',
  component: SettingPageContent,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof SettingPageContent>;

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-background min-h-screen">
      <SettingPageContent />
    </div>
  ),
};
