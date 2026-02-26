'use client';

// Libraries
import { useMemo } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Utils
import { getStrapiMedia } from '@/utils';

// Icons
import { SearchIcon, SettingIcon, NotificationIcon } from '@/components/Icons';

// Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AvatarProfile } from '@/components/AvatarProfile';

interface DashboardHeaderContentProps {
  memberName: string;
  memberInitials: string;
  memberImageUrl: string;
}

const toTitleCase = (segment: string) => {
  return segment
    .replace(/[-_]+/g, ' ')
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
};

export const DashboardHeaderContent = ({
  memberName,
  memberInitials,
  memberImageUrl,
}: DashboardHeaderContentProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const generatedTitle = useMemo((): string => {
    const paramTitle = searchParams?.get('title');
    if (paramTitle && paramTitle.trim().length > 0) return paramTitle.trim();
    if (!pathname) return 'Dashboard';
    const parts = pathname.split('/').filter(Boolean);

    if (parts.length === 2 && parts[0] === 'cards') {
      return 'Card Details';
    }

    const last = parts[parts.length - 1] ?? '';
    return parts.length === 0 ? 'Dashboard' : toTitleCase(last);
  }, [pathname, searchParams]);

  return (
    <header className="h-16 sm:h-20 md:h-[100px] bg-white border-b border-neutral-10 px-4 sm:px-6 md:px-10">
      <div className="h-full flex items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl md:text-[28px] font-semibold text-tx-primary ml-14 lg:ml-0">
          {generatedTitle}
        </h1>

        <div className="flex items-center gap-2 sm:gap-4 md:gap-8">
          {/* Search */}
          <div className="relative w-32 sm:w-48 md:w-[255px] hidden sm:block">
            <SearchIcon className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-4 md:w-5 h-4 md:h-5" />
            <Input
              placeholder="Search for something"
              className="pl-10 md:pl-14 h-10 md:h-[50px] rounded-[40px] bg-neutral-10 border-0 text-sm md:text-[15px] text-tx-primary placeholder:text-neutral-30"
            />
          </div>

          {/* Settings Icon */}
          <Button
            variant="ghost"
            size="md"
            className="w-10 h-10 md:w-[50px] md:h-[50px] px-0 rounded-full bg-neutral-10 flex items-center justify-center hover:bg-gray-200 transition-colors"
            aria-label="Settings"
          >
            <SettingIcon className="w-5 h-5 md:w-6 md:h-6" />
          </Button>

          {/* Notification Icon */}
          <Button
            variant="ghost"
            size="md"
            className="w-10 h-10 md:w-[50px] md:h-[50px] px-0 rounded-full bg-neutral-10 flex items-center justify-center hover:bg-gray-200 transition-colors relative"
            aria-label="Notifications"
          >
            <NotificationIcon className="w-5 h-5 md:w-6 md:h-6" />
          </Button>
          {/* Profile Avatar with Dropdown */}
          <AvatarProfile
            imageUrl={getStrapiMedia(memberImageUrl) ?? ''}
            fallback={memberInitials}
            alt={memberName}
          />
        </div>
      </div>
    </header>
  );
};
