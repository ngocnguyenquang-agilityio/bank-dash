import type { Meta, StoryObj } from '@storybook/nextjs';
import { Pagination } from './Pagination';

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onPageChange: () => {},
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstPage: Story = {
  args: {
    page: 1,
    pageCount: 5,
  },
};

export const MiddlePage: Story = {
  args: {
    page: 3,
    pageCount: 5,
  },
};

export const LastPage: Story = {
  args: {
    page: 5,
    pageCount: 5,
  },
};

export const TwoPages: Story = {
  args: {
    page: 1,
    pageCount: 2,
  },
};

export const ManyPages: Story = {
  args: {
    page: 5,
    pageCount: 10,
  },
};

export const SinglePage: Story = {
  args: {
    page: 1,
    pageCount: 1,
  },
};
