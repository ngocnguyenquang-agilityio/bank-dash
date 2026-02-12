'use client';

// Libraries
import { useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { effectTsResolver } from '@hookform/resolvers/effect-ts';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Components
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Icons } from '@/components/Icons/Icons';
import { UnsavedChangesModal } from '@/components/UnsavedChangesModal/UnsavedChangesModal';

// Services
import { updateMember } from '@/services/members';

// Types
import { MemberProfileSchema, type Member, type MemberProfile } from '@/types/member';

// Utils
import { getStrapiMedia } from '@/utils';

const PROFILE_IMAGE = '/next.svg';

interface SettingPageContentProps {
  initialData?: Member | null;
}

export const SettingPageContent = ({ initialData }: SettingPageContentProps) => {
  const router = useRouter();
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors, isDirty, isSubmitting, dirtyFields },
  } = useForm({
    resolver: effectTsResolver(MemberProfileSchema),
    defaultValues: {
      name: initialData?.name || '',
      userName: initialData?.userName || '',
      email: initialData?.email || '',
      dob: initialData?.dob || '',
      presentAddress: initialData?.presentAddress || '',
      permanentAddress: initialData?.permanentAddress || '',
      city: initialData?.city || '',
      postalCode: initialData?.postalCode || '',
      country: initialData?.country || '',
    },
  });

  const dob = useWatch({ control, name: 'dob' });

  const onSubmit = async (data: MemberProfile) => {
    if (!initialData?.documentId) {
      toast.error('User not found');
      return;
    }

    const changedData = Object.keys(dirtyFields).reduce((acc, key) => {
      const fieldKey = key as keyof MemberProfile;
      if (dirtyFields[fieldKey]) {
        return { ...acc, [fieldKey]: data[fieldKey] };
      }
      return acc;
    }, {} as Partial<MemberProfile>);

    if (Object.keys(changedData).length === 0) {
      return;
    }

    const { success, error } = await updateMember(initialData.documentId, changedData);

    if (success) {
      toast.success('Profile updated successfully');
      reset(data); // Reset form state with new data
      router.refresh();
    } else {
      toast.error(error || 'Failed to update profile');
    }
  };

  return (
    <div className="bg-white rounded-[25px] p-6 sm:p-8 lg:p-[30px]">
      <Tabs defaultValue="edit-profile" onValueChange={() => {}}>
        <TabsList
          variant="line"
          className="w-full justify-start gap-0 border-b border-neutral-20 mb-0 h-auto p-0"
        >
          <TabsTrigger
            value="edit-profile"
            className="px-4 sm:px-6 pb-3 text-base font-medium text-blue-20 rounded-none border-0 data-[state=active]:text-blue-50 data-[state=active]:shadow-none after:h-[3px] after:bottom-0 after:rounded-t-[10px] after:bg-blue-50"
          >
            Edit Profile
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="px-4 sm:px-6 pb-3 text-base font-medium text-blue-20 rounded-none border-0 data-[state=active]:text-blue-50 data-[state=active]:shadow-none after:h-[3px] after:bottom-0 after:rounded-t-[10px] after:bg-blue-50"
          >
            Preferences
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="px-4 sm:px-6 pb-3 text-base font-medium text-blue-20 rounded-none border-0 data-[state=active]:text-blue-50 data-[state=active]:shadow-none after:h-[3px] after:bottom-0 after:rounded-t-[10px] after:bg-blue-50"
          >
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit-profile" className="mt-6 sm:mt-8 lg:mt-10">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col lg:flex-row gap-8 lg:gap-14"
          >
            {/* Profile Avatar */}
            <div className="flex justify-center lg:justify-start shrink-0">
              <div className="relative w-[130px] h-[130px]">
                <div className="w-[130px] h-[130px] rounded-full overflow-hidden bg-neutral-20">
                  <Image
                    src={getStrapiMedia(initialData?.photo?.url) || PROFILE_IMAGE}
                    alt="Profile"
                    width={130}
                    height={130}
                    className="w-full h-full object-cover"
                    unoptimized={
                      getStrapiMedia(initialData?.photo?.url)?.includes('localhost') ||
                      getStrapiMedia(initialData?.photo?.url)?.includes('127.0.0.1') ||
                      false
                    }
                  />
                </div>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 w-[30px] h-[30px] rounded-full bg-blue-50 flex items-center justify-center cursor-pointer hover:bg-blue-60 transition-colors"
                  aria-label="Edit profile picture"
                >
                  <Icons.Pencil className="text-white w-[15px] h-[15px]" />
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 lg:gap-x-[29px] gap-y-[22px]">
              {/* Row 1 */}
              <div className="space-y-[11px]">
                <label htmlFor="name" className="block text-base text-black">
                  Your Name
                </label>
                <Input
                  id="name"
                  {...register('name')}
                  className="h-[50px] rounded-[15px] border-neutral-20 bg-white px-5 text-[15px] text-blue-20 placeholder:text-blue-20 focus-visible:ring-blue-50"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>

              <div className="space-y-[11px]">
                <label htmlFor="userName" className="block text-base text-black">
                  User Name
                </label>
                <Input
                  id="userName"
                  {...register('userName')}
                  className="h-[50px] rounded-[15px] border-neutral-20 bg-white px-5 text-[15px] text-blue-20 placeholder:text-blue-20 focus-visible:ring-blue-50"
                />
                {errors.userName && (
                  <p className="text-red-500 text-sm">{errors.userName.message}</p>
                )}
              </div>

              {/* Row 2 */}
              <div className="space-y-[11px]">
                <label htmlFor="email" className="block text-base text-black">
                  Email
                </label>
                <Input
                  id="email"
                  {...register('email')}
                  type="email"
                  className="h-[50px] rounded-[15px] border-neutral-20 bg-white px-5 text-[15px] text-blue-20 placeholder:text-blue-20 focus-visible:ring-blue-50"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>

              <div className="space-y-[11px]">
                <label htmlFor="password" className="block text-base text-black">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value="**********"
                  disabled
                  className="h-[50px] rounded-[15px] border-neutral-20 bg-neutral-10 px-5 text-[15px] text-blue-20 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* Row 3 */}
              <div className="space-y-[11px]">
                <label htmlFor="dob" className="block text-base text-black">
                  Date of Birth
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-[50px] rounded-[15px] border-neutral-20 bg-white text-[15px] text-blue-20 justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dob ? format(new Date(dob), 'PPP') : 'Select date'}
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
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-[11px]">
                <label htmlFor="presentAddress" className="block text-base text-black">
                  Present Address
                </label>
                <Input
                  id="presentAddress"
                  {...register('presentAddress')}
                  className="h-[50px] rounded-[15px] border-neutral-20 bg-white px-5 text-[15px] text-blue-20 placeholder:text-blue-20 focus-visible:ring-blue-50"
                />
              </div>

              {/* Row 4 */}
              <div className="space-y-[11px]">
                <label htmlFor="permanentAddress" className="block text-base text-black">
                  Permanent Address
                </label>
                <Input
                  id="permanentAddress"
                  {...register('permanentAddress')}
                  className="h-[50px] rounded-[15px] border-neutral-20 bg-white px-5 text-[15px] text-blue-20 placeholder:text-blue-20 focus-visible:ring-blue-50"
                />
              </div>

              <div className="space-y-[11px]">
                <label htmlFor="city" className="block text-base text-black">
                  City
                </label>
                <Input
                  id="city"
                  {...register('city')}
                  className="h-[50px] rounded-[15px] border-neutral-20 bg-white px-5 text-[15px] text-blue-20 placeholder:text-blue-20 focus-visible:ring-blue-50"
                />
              </div>

              {/* Row 5 */}
              <div className="space-y-[11px]">
                <label htmlFor="postalCode" className="block text-base text-black">
                  Postal Code
                </label>
                <Input
                  id="postalCode"
                  {...register('postalCode')}
                  className="h-[50px] rounded-[15px] border-neutral-20 bg-white px-5 text-[15px] text-blue-20 placeholder:text-blue-20 focus-visible:ring-blue-50"
                />
              </div>

              <div className="space-y-[11px]">
                <label htmlFor="country" className="block text-base text-black">
                  Country
                </label>
                <Input
                  id="country"
                  {...register('country')}
                  className="h-[50px] rounded-[15px] border-neutral-20 bg-white px-5 text-[15px] text-blue-20 placeholder:text-blue-20 focus-visible:ring-blue-50"
                />
              </div>

              {/* Save Button */}
              <div className="md:col-span-2 flex justify-end mt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting || !isDirty}
                  className="w-full md:w-[190px] h-[50px] rounded-[15px] bg-blue-50 text-white text-lg font-medium hover:bg-blue-60 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save'}
                </Button>
              </div>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="preferences" className="mt-6 sm:mt-8 lg:mt-10">
          <div className="flex min-h-[400px] items-center justify-center text-blue-20">
            <p className="text-lg">Preferences settings coming soon.</p>
          </div>
        </TabsContent>

        <TabsContent value="security" className="mt-6 sm:mt-8 lg:mt-10">
          <div className="flex min-h-[400px] items-center justify-center text-blue-20">
            <p className="text-lg">Security settings coming soon.</p>
          </div>
        </TabsContent>
      </Tabs>

      <UnsavedChangesModal
        open={showUnsavedModal}
        onOpenChange={setShowUnsavedModal}
        onConfirm={() => {
          setShowUnsavedModal(false);
        }}
        onCancel={() => setShowUnsavedModal(false)}
      />
    </div>
  );
};
