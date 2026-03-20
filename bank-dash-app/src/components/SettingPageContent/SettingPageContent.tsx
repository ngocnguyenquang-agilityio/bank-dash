'use client';

// Libraries
import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { effectTsResolver } from '@hookform/resolvers/effect-ts';
import { toast } from 'sonner';

// Components
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Icons } from '@/components/Icons/Icons';
import { DateOfBirthField } from '@/components/DateOfBirthField';
import { UnsavedChangesModal } from '@/components/UnsavedChangesModal/UnsavedChangesModal';

// Services
import { updateMember, uploadAvatar } from '@/services/members';

// Types
import { MemberProfileSchema, type Member, type MemberProfile } from '@/types/member';

// Utils
import { getInitials, getStrapiMedia } from '@/utils';

// Constants
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/constants/upload';

interface SettingPageContentProps {
  initialData?: Member | null;
}

export const SettingPageContent = ({ initialData }: SettingPageContentProps) => {
  const memberInitials = getInitials(initialData?.name || 'User');
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors, isDirty, dirtyFields },
  } = useForm<MemberProfile>({
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

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_TYPES)[number])) {
        toast.error('Invalid file type. Please upload a JPEG, PNG, or WebP image.');
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error('File is too large. Maximum size is 5MB.');
        return;
      }

      // Clean up previous preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));

      // Reset input so the same file can be re-selected
      e.target.value = '';
    },
    [previewUrl],
  );

  const onSubmit = async (data: MemberProfile) => {
    if (!initialData?.documentId) {
      toast.error('User not found');
      return;
    }

    setIsLoading(true);

    try {
      let uploadedPhotoId: number | null = null;

      // Upload avatar if a new file was selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const uploadResult = await uploadAvatar(formData);

        if (!uploadResult.success || !uploadResult.fileId) {
          toast.error(uploadResult.error || 'Failed to upload avatar');
          return;
        }

        uploadedPhotoId = uploadResult.fileId;
      }

      // Build update payload: always include photo to preserve or update the relation
      const sanitizedData = {
        ...data,
        postalCode: data.postalCode || null,
        dob: data.dob || null,
        photo: uploadedPhotoId ?? initialData.photo?.id ?? null,
      };

      const hasChangedFields = Object.values(dirtyFields).some(Boolean);

      if (hasChangedFields || uploadedPhotoId) {
        const { success, error } = await updateMember(initialData.documentId, sanitizedData);

        if (!success) {
          toast.error(error || 'Failed to update profile');
          return;
        }
      }

      toast.success('Profile updated successfully');
      reset(data);

      // Clean up file state
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setSelectedFile(null);
      setPreviewUrl(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    await handleSubmit(onSubmit)(e);
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
            className="flex-none justify-start px-4 sm:px-6 pb-3 text-base font-medium text-blue-20 rounded-none border-0 data-[state=active]:text-blue-50 data-[state=active]:shadow-none after:h-[3px] after:rounded-t-[10px] after:bg-blue-50"
          >
            Edit Profile
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="flex-none justify-start px-4 sm:px-6 pb-3 text-base font-medium text-blue-20 rounded-none border-0 data-[state=active]:text-blue-50 data-[state=active]:shadow-none after:h-[3px] after:rounded-t-[10px] after:bg-blue-50"
          >
            Preferences
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="flex-none justify-start px-4 sm:px-6 pb-3 text-base font-medium text-blue-20 rounded-none border-0 data-[state=active]:text-blue-50 data-[state=active]:shadow-none after:h-[3px] after:rounded-t-[10px] after:bg-blue-50"
          >
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit-profile" className="mt-6 sm:mt-8 lg:mt-[53px]">
          <form onSubmit={handleFormSubmit} className="flex flex-col lg:flex-row gap-8 lg:gap-14">
            {/* Profile Avatar */}
            <div className="flex justify-center lg:justify-start shrink-0">
              <div className="relative w-[130px] h-[130px]">
                <div className="w-[130px] h-[130px] rounded-full overflow-hidden bg-neutral-20">
                  {previewUrl ? (
                    <Image
                      src={previewUrl}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : getStrapiMedia(initialData?.photo?.url) ? (
                    <Image
                      src={getStrapiMedia(initialData?.photo?.url)!}
                      alt={`${initialData?.name || 'User'} profile picture`}
                      width={130}
                      height={130}
                      className="w-full h-full object-cover"
                      unoptimized={
                        getStrapiMedia(initialData?.photo?.url)?.includes('localhost') ||
                        getStrapiMedia(initialData?.photo?.url)?.includes('127.0.0.1') ||
                        false
                      }
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white text-4xl font-semibold">
                      {memberInitials}
                    </span>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                  aria-label="Upload profile picture"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
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
                  placeholder="Enter your name"
                  className="h-[50px] rounded-[15px] border-neutral-20 bg-white px-5 text-[15px] text-tx-primary placeholder:text-tx-secondary focus-visible:ring-blue-50"
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
                  placeholder="Enter your username"
                  className="h-[50px] rounded-[15px] border-neutral-20 bg-white px-5 text-[15px] text-tx-primary placeholder:text-tx-secondary focus-visible:ring-blue-50"
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
                  placeholder="Enter your email"
                  className="h-[50px] rounded-[15px] border-neutral-20 bg-white px-5 text-[15px] text-tx-primary placeholder:text-tx-secondary focus-visible:ring-blue-50"
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
                  className="h-[50px] rounded-[15px] border-neutral-20 bg-neutral-10 px-5 text-[15px] text-tx-primary disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* Row 3 */}
              <div className="space-y-[11px]">
                <label htmlFor="dob" className="block text-base text-black">
                  Date of Birth
                </label>
                <DateOfBirthField control={control} setValue={setValue} />
              </div>

              <div className="space-y-[11px]">
                <label htmlFor="presentAddress" className="block text-base text-black">
                  Present Address
                </label>
                <Input
                  id="presentAddress"
                  {...register('presentAddress')}
                  placeholder="Enter present address"
                  className="h-[50px] rounded-[15px] border-neutral-20 bg-white px-5 text-[15px] text-tx-primary placeholder:text-tx-secondary focus-visible:ring-blue-50"
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
                  placeholder="Enter permanent address"
                  className="h-[50px] rounded-[15px] border-neutral-20 bg-white px-5 text-[15px] text-tx-primary placeholder:text-tx-secondary focus-visible:ring-blue-50"
                />
              </div>

              <div className="space-y-[11px]">
                <label htmlFor="city" className="block text-base text-black">
                  City
                </label>
                <Input
                  id="city"
                  {...register('city')}
                  placeholder="Enter your city"
                  className="h-[50px] rounded-[15px] border-neutral-20 bg-white px-5 text-[15px] text-tx-primary placeholder:text-tx-secondary focus-visible:ring-blue-50"
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
                  placeholder="Enter postal code"
                  className="h-[50px] rounded-[15px] border-neutral-20 bg-white px-5 text-[15px] text-tx-primary placeholder:text-tx-secondary focus-visible:ring-blue-50"
                />
              </div>

              <div className="space-y-[11px]">
                <label htmlFor="country" className="block text-base text-black">
                  Country
                </label>
                <Input
                  id="country"
                  {...register('country')}
                  placeholder="Enter your country"
                  className="h-[50px] rounded-[15px] border-neutral-20 bg-white px-5 text-[15px] text-tx-primary placeholder:text-tx-secondary focus-visible:ring-blue-50"
                />
              </div>

              {/* Save Button */}
              <div className="md:col-span-2 flex justify-end mt-2">
                <Button
                  type="submit"
                  disabled={isLoading || (!isDirty && !selectedFile)}
                  className="w-full md:w-[190px] h-[50px] rounded-[15px] bg-blue-50 text-white text-lg font-medium hover:bg-blue-60 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save'}
                </Button>
              </div>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="preferences" className="mt-6 sm:mt-8 lg:mt-[53px]">
          <div className="flex min-h-[400px] items-center justify-center text-blue-20">
            <p className="text-lg">Preferences settings coming soon.</p>
          </div>
        </TabsContent>

        <TabsContent value="security" className="mt-6 sm:mt-8 lg:mt-[53px]">
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
