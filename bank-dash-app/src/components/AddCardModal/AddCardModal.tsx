'use client';

// Libraries
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { effectTsResolver } from '@hookform/resolvers/effect-ts';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { format } from 'date-fns';

// Types
import { CardFormSchema, CardTypes, type CardFormData } from '@/types/card';

// Components
import {
  DialogTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from '@/components/ui/Dialog';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Calendar } from '@/components/ui/Calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { UnsavedChangesModal } from '@/components/UnsavedChangesModal';
import { CalendarIcon } from 'lucide-react';

// Services
import { addCard } from '@/services/cards';

interface AddCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddCardModal = ({ open, onOpenChange }: AddCardModalProps) => {
  const { user } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    control,
    reset,
  } = useForm<CardFormData>({
    resolver: effectTsResolver(CardFormSchema),
    defaultValues: {
      isPhysical: true,
      nameOnCard: '',
      cardNumber: '',
      expiration: '',
      balance: '',
      address: '',
    },
  });

  const isPhysical = useWatch({ control, name: 'isPhysical' });

  const {
    showUnsavedChanges,
    setShowUnsavedChanges,
    handleOpenChange,
    handleConfirmClose,
    handleCancelClose,
  } = useUnsavedChanges({
    isDirty,
    onOpenChange,
    onReset: reset,
  });

  const formatCardNumber = (value: string): string => {
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, '');

    // Limit to 16 digits
    const limitedDigits = digitsOnly.slice(0, 16);

    // Add dashes every 4 digits
    const formatted = limitedDigits.replace(/(\d{4})(?=\d)/g, '$1-');

    return formatted;
  };

  const formatBalance = (value: string): string => {
    // Remove commas to get raw digits
    const raw = value.replace(/,/g, '');

    // Allow only digits and one decimal point with max 2 decimal places
    if (raw !== '' && !/^\d*\.?\d{0,2}$/.test(raw)) return value;

    const parts = raw.split('.');
    const integerPart = (parts[0] ?? '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.length === 2 ? `${integerPart}.${parts[1] ?? ''}` : integerPart;
  };

  const onSubmit = useCallback(
    async (data: CardFormData) => {
      setIsSubmitting(true);

      try {
        const sanitizedData = {
          ...data,
          cardNumber: data.cardNumber.replace(/-/g, ''),
          balance: data.balance?.replace(/,/g, ''),
        };

        const result = await addCard(user!.id, sanitizedData);

        if (result.success) {
          toast.success('Card added successfully');
          reset();
          onOpenChange(false);
          router.refresh();
        } else {
          toast.error(result.error || 'Failed to add card');
        }
      } catch {
        toast.error('An unexpected error occurred');
      } finally {
        setIsSubmitting(false);
      }
    },
    [user, reset, onOpenChange, router],
  );

  return (
    <>
      <UnsavedChangesModal
        open={showUnsavedChanges}
        onOpenChange={setShowUnsavedChanges}
        onConfirm={handleConfirmClose}
        onCancel={handleCancelClose}
      />

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="rounded-[20px] p-0 gap-0 sm:max-w-2xl">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="px-5 py-6 sm:px-[30px] sm:py-[27px] space-y-[30px]"
          >
            <DialogHeader>
              <DialogTitle className="sr-only">Add New Credit Card</DialogTitle>
              <DialogDescription className="text-base leading-[28px] text-neutral-30">
                Credit Card generally means a plastic card issued by Scheduled Commercial Banks
                assigned to a Cardholder, with a credit limit, that can be used to purchase goods
                and services on credit or obtain cash advances.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-[22px]">
              {/* Card Type and Name On Card - First Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[22px] sm:gap-[30px]">
                <div className="space-y-[11px]">
                  <Label htmlFor="card-type" className="text-base text-black">
                    Card Type
                  </Label>
                  <Controller
                    name="isPhysical"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value ? CardTypes.Physical : CardTypes.Virtual}
                        onValueChange={(value) => field.onChange(value === CardTypes.Physical)}
                      >
                        <SelectTrigger
                          id="card-type"
                          className="w-full h-[50px] rounded-[15px] border-neutral-20 bg-white text-[15px] text-primary"
                        >
                          <SelectValue placeholder="Virtual / Physical" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={CardTypes.Virtual}>Virtual</SelectItem>
                          <SelectItem value={CardTypes.Physical}>Physical</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.isPhysical && (
                    <p className="text-sm text-red-500">{errors.isPhysical.message}</p>
                  )}
                </div>

                <div className="space-y-[11px]">
                  <Label htmlFor="name-on-card" className="text-base text-black">
                    Name On Card
                  </Label>
                  <Input
                    id="name-on-card"
                    placeholder="My Cards"
                    {...register('nameOnCard')}
                    className="h-[50px] rounded-[15px] border-neutral-20 text-[15px] text-primary placeholder:text-neutral-30"
                  />
                  {errors.nameOnCard && (
                    <p className="text-sm text-red-500">{errors.nameOnCard.message}</p>
                  )}
                </div>
              </div>

              {/* Card Number and Expiration Date - Second Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[22px] sm:gap-[30px]">
                <div className="space-y-[11px]">
                  <Label htmlFor="card-number" className="text-base text-black">
                    Card Number
                  </Label>
                  <Controller
                    name="cardNumber"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="card-number"
                        placeholder="**** **** **** ****"
                        value={field.value}
                        onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value);
                          field.onChange(formatted);
                        }}
                        className="h-[50px] rounded-[15px] border-neutral-20 text-[15px] text-primary placeholder:text-neutral-30"
                      />
                    )}
                  />
                  {errors.cardNumber && (
                    <p className="text-sm text-red-500">{errors.cardNumber.message}</p>
                  )}
                </div>

                <div className="space-y-[11px]">
                  <Label htmlFor="expiration-date" className="text-base text-black">
                    Expiration Date
                  </Label>
                  <Controller
                    name="expiration"
                    control={control}
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full h-[50px] rounded-[15px] border-neutral-20 bg-white text-[15px] text-primary justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(new Date(field.value), 'PPP') : 'Pick a date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) =>
                              field.onChange(date ? format(date, 'yyyy-MM-dd') : '')
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {errors.expiration && (
                    <p className="text-sm text-red-500">{errors.expiration.message}</p>
                  )}
                </div>
              </div>

              {/* Balance and Address - Third Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[22px] sm:gap-[30px]">
                <div className="space-y-[11px]">
                  <Label htmlFor="balance" className="text-base text-black">
                    Balance
                  </Label>
                  <Controller
                    name="balance"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="balance"
                        placeholder="0.00"
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const formatted = formatBalance(e.target.value);
                          field.onChange(formatted);
                        }}
                        className="h-[50px] rounded-[15px] border-neutral-20 text-[15px] text-primary placeholder:text-neutral-30"
                      />
                    )}
                  />
                  {errors.balance && (
                    <p className="text-sm text-red-500">{errors.balance.message}</p>
                  )}
                </div>

                {isPhysical && (
                  <div className="space-y-[11px]">
                    <Label htmlFor="address" className="text-base text-black">
                      Address
                    </Label>
                    <Input
                      id="address"
                      placeholder="Enter your address"
                      {...register('address')}
                      className="h-[50px] rounded-[15px] border-neutral-20 text-[15px] text-primary placeholder:text-neutral-30"
                    />
                    {errors.address && (
                      <p className="text-sm text-red-500">{errors.address.message}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-[24px] pt-[9px]">
              <Button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="h-[50px] w-full sm:w-[160px] rounded-[9px] bg-neutral-30 hover:bg-neutral-30/90 text-white text-[18px] font-medium"
              >
                Close
              </Button>
              <Button
                type="submit"
                disabled={!isDirty || isSubmitting}
                className="h-[50px] w-full sm:w-[160px] rounded-[9px] bg-blue-50 hover:bg-blue-50/90 text-white text-[18px] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Adding...' : 'Add Card'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
