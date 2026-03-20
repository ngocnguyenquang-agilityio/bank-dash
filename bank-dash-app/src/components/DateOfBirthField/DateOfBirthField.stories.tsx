// Libraries
import { useForm } from 'react-hook-form';
import type { Meta, StoryObj } from '@storybook/nextjs';

// Components
import { DateOfBirthField } from './DateOfBirthField';

// Types
import type { MemberProfile } from '@/types/member';

const meta: Meta<typeof DateOfBirthField> = {
  title: 'Components/DateOfBirthField',
  component: DateOfBirthField,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof DateOfBirthField>;

const DateOfBirthFieldWrapper = ({ defaultDob = '' }: { defaultDob?: string }) => {
  const { control, setValue } = useForm<MemberProfile>({
    defaultValues: {
      name: '',
      userName: '',
      email: '',
      dob: defaultDob,
    },
  });

  return (
    <div className="w-[300px]">
      <DateOfBirthField control={control} setValue={setValue} />
    </div>
  );
};

export const Empty: Story = {
  render: () => <DateOfBirthFieldWrapper />,
};

export const WithDate: Story = {
  render: () => <DateOfBirthFieldWrapper defaultDob="1990-05-15" />,
};
