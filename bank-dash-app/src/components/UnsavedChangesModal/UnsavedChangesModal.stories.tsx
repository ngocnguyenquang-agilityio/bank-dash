import type { Meta, StoryObj } from '@storybook/nextjs';
import { UnsavedChangesModal } from './UnsavedChangesModal';

const meta = {
  title: 'Components/UnsavedChangesModal',
  component: UnsavedChangesModal,
  parameters: {
    layout: 'centered',
  },
  args: {
    onOpenChange: () => {},
    onConfirm: () => {},
    onCancel: () => {},
  },
} satisfies Meta<typeof UnsavedChangesModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
  },
};
