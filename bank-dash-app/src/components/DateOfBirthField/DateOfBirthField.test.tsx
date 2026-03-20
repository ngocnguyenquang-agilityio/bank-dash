// Libraries
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';

// Components
import { DateOfBirthField } from './DateOfBirthField';

// Types
import type { MemberProfile } from '@/types/member';

// Mock ResizeObserver for Radix UI
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

const TestWrapper = ({ defaultDob = '' }: { defaultDob?: string }) => {
  const { control, setValue } = useForm<MemberProfile>({
    defaultValues: {
      name: '',
      userName: '',
      email: '',
      dob: defaultDob,
    },
  });
  return <DateOfBirthField control={control} setValue={setValue} />;
};

describe('DateOfBirthField', () => {
  it('renders "Select date" placeholder when no date is set', () => {
    render(<TestWrapper />);

    expect(screen.getByRole('button', { name: /select date/i })).toBeInTheDocument();
  });

  it('renders formatted date when a dob value is provided', () => {
    const dob = '1990-05-15';
    render(<TestWrapper defaultDob={dob} />);

    expect(screen.getByText(format(new Date(dob), 'PPP'))).toBeInTheDocument();
    expect(screen.queryByText('Select date')).not.toBeInTheDocument();
  });

  it('opens the calendar popover when the trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    await user.click(screen.getByRole('button', { name: /select date/i }));

    expect(await screen.findByRole('grid')).toBeInTheDocument();
  });

  it('updates the displayed date when a calendar day is selected', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    await user.click(screen.getByRole('button', { name: /select date/i }));

    const grid = await screen.findByRole('grid');
    const enabledDayButtons = within(grid)
      .getAllByRole('button')
      .filter(
        (btn) =>
          /^\d+$/.test(btn.textContent?.trim() ?? '') &&
          btn.getAttribute('aria-disabled') !== 'true',
      );

    expect(enabledDayButtons.length).toBeGreaterThan(0);
    await user.click(enabledDayButtons[0]);

    expect(screen.queryByText('Select date')).not.toBeInTheDocument();
  });
});
