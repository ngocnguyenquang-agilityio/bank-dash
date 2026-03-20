'use client';

import { format } from 'date-fns';
import { ChevronDown } from 'lucide-react';
import { useWatch, type Control, type UseFormSetValue } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { Calendar } from '@/components/ui/Calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';

import type { MemberProfile } from '@/types/member';

interface DateOfBirthFieldProps {
  control: Control<MemberProfile>;
  setValue: UseFormSetValue<MemberProfile>;
}

export const DateOfBirthField = ({ control, setValue }: DateOfBirthFieldProps) => {
  const dob = useWatch({ control, name: 'dob' });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full h-[50px] rounded-[15px] border-neutral-20 bg-white px-5 text-[15px] justify-between text-left font-normal ${dob ? 'text-tx-primary' : 'text-tx-secondary'}`}
        >
          {dob ? format(new Date(dob), 'PPP') : 'Select date'}
          <ChevronDown className="h-5 w-5 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={dob ? new Date(dob) : undefined}
          onSelect={(date) =>
            setValue('dob', date ? format(date, 'yyyy-MM-dd') : '', {
              shouldDirty: true,
            })
          }
          startMonth={new Date(1900, 0)}
          endMonth={new Date()}
          disabled={{ after: new Date() }}
        />
      </PopoverContent>
    </Popover>
  );
};
