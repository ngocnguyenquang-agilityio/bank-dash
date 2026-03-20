import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { AddCardModal } from '.';
import { Button } from '@/components/ui/Button';

const meta: Meta<typeof AddCardModal> = {
  title: 'Components/AddCardModal',
  component: AddCardModal,
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/cards',
        searchParams: {},
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof AddCardModal>;

const AddCardModalWithTrigger = () => {
  const [open, setOpen] = useState(true);

  return (
    <div className="p-10 bg-background min-h-[400px]">
      <Button onClick={() => setOpen(true)}>Add New Card</Button>
      <AddCardModal open={open} onOpenChange={setOpen} />
    </div>
  );
};

export const Default: Story = {
  render: () => <AddCardModalWithTrigger />,
};

export const Closed: Story = {
  args: {
    open: false,
    onOpenChange: () => {},
  },
};
