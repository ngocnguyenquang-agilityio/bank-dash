'use client';

import * as React from 'react';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { DayPicker, getDefaultClassNames, type DayButton } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

const CalendarDropdown = ({
  value,
  onChange,
  options,
}: {
  value?: string | number | readonly string[];
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  options?: { value: number; label: string; disabled: boolean }[];
}) => {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const selectedOption = options?.find((opt) => opt.value === Number(value));

  React.useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  React.useEffect(() => {
    if (open && listRef.current) {
      const selected = listRef.current.querySelector('[data-selected="true"]') as HTMLElement;
      selected?.scrollIntoView({ block: 'nearest' });
    }
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="relative"
      onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-7 min-w-[4.5rem] items-center justify-between gap-1 rounded-md border border-input bg-background px-2 text-xs font-medium shadow-xs hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
      >
        <span>{selectedOption?.label}</span>
        <ChevronDownIcon
          className={cn(
            'size-3 shrink-0 text-muted-foreground transition-transform duration-150',
            open && 'rotate-180',
          )}
        />
      </button>
      {open && (
        <div
          ref={listRef}
          onWheel={(e) => e.stopPropagation()}
          className="absolute left-0 top-full z-50 mt-1 max-h-44 min-w-full overflow-y-auto overscroll-contain rounded-md border border-border bg-popover py-1 shadow-md"
        >
          {options?.map((opt) => (
            <button
              key={opt.value}
              type="button"
              data-selected={opt.value === Number(value)}
              disabled={opt.disabled}
              onClick={() => {
                onChange?.({
                  target: { value: String(opt.value) },
                } as React.ChangeEvent<HTMLSelectElement>);
                setOpen(false);
              }}
              className={cn(
                'flex w-full items-center px-3 py-1.5 text-left text-xs hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50',
                opt.value === Number(value) && 'bg-primary/10 font-semibold text-primary',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Calendar = ({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'dropdown',
  startMonth = new Date(2000, 0),
  endMonth = new Date(new Date().getFullYear() + 10, 11),
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant'];
}) => {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      startMonth={startMonth}
      endMonth={endMonth}
      className={cn(
        'bg-background group/calendar p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent',
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className,
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) => date.toLocaleString('default', { month: 'short' }),
        ...formatters,
      }}
      classNames={{
        root: cn('w-fit', defaultClassNames.root),
        months: cn('flex gap-4 flex-col md:flex-row relative', defaultClassNames.months),
        month: cn('flex flex-col w-full gap-4', defaultClassNames.month),
        nav: cn(
          'flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between',
          defaultClassNames.nav,
        ),
        button_previous: cn(
          'size-(--cell-size) aria-disabled:opacity-50 p-0 select-none',
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          'size-(--cell-size) aria-disabled:opacity-50 p-0 select-none',
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          'flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)',
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          'w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5',
          defaultClassNames.dropdowns,
        ),
        dropdown_root: cn('relative', defaultClassNames.dropdown_root),
        dropdown: 'sr-only',
        caption_label: cn(
          'select-none font-medium',
          captionLayout === 'label'
            ? 'text-sm'
            : 'rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5',
          defaultClassNames.caption_label,
        ),
        table: 'w-full border-collapse',
        weekdays: cn('flex', defaultClassNames.weekdays),
        weekday: cn(
          'text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none',
          defaultClassNames.weekday,
        ),
        week: cn('flex w-full mt-2', defaultClassNames.week),
        week_number_header: cn('select-none w-(--cell-size)', defaultClassNames.week_number_header),
        week_number: cn(
          'text-[0.8rem] select-none text-muted-foreground',
          defaultClassNames.week_number,
        ),
        day: cn(
          'relative w-full h-full p-0 text-center [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none',
          props.showWeekNumber
            ? '[&:nth-child(2)[data-selected=true]_button]:rounded-l-md'
            : '[&:first-child[data-selected=true]_button]:rounded-l-md',
          defaultClassNames.day,
        ),
        range_start: cn('rounded-l-md bg-accent', defaultClassNames.range_start),
        range_middle: cn('rounded-none', defaultClassNames.range_middle),
        range_end: cn('rounded-r-md bg-accent', defaultClassNames.range_end),
        today: cn(
          'font-semibold rounded-md data-[selected=true]:rounded-none',
          defaultClassNames.today,
        ),
        outside: cn(
          'text-muted-foreground aria-selected:text-muted-foreground',
          defaultClassNames.outside,
        ),
        disabled: cn('text-muted-foreground opacity-50', defaultClassNames.disabled),
        hidden: cn('invisible', defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Dropdown: CalendarDropdown,
        Root: ({ className, rootRef, ...props }) => {
          return <div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />;
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === 'left') {
            return <ChevronLeftIcon className={cn('size-4', className)} {...props} />;
          }

          if (orientation === 'right') {
            return <ChevronRightIcon className={cn('size-4', className)} {...props} />;
          }

          return <ChevronDownIcon className={cn('size-4', className)} {...props} />;
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          );
        },
        ...components,
      }}
      {...props}
    />
  );
};

const CalendarDayButton = ({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) => {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        'data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[selected-single=true]:font-semibold data-[range-middle=true]:bg-primary/10 data-[range-middle=true]:text-primary data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-start=true]:font-semibold data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground data-[range-end=true]:font-semibold group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 dark:hover:text-white flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md [&>span]:text-xs [&>span]:opacity-70 hover:bg-primary/50 hover:text-white data-[selected-single=true]:hover:bg-primary data-[selected-single=true]:hover:text-primary-foreground',
        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  );
};

export { Calendar, CalendarDayButton };
