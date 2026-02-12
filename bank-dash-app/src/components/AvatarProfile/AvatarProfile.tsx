'use client';

// Libraries
import { useRouter } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';

// Components
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Icons
import { SettingIcon, SignoutIcon } from '@/components/Icons';

// Constants
import { ROUTES } from '@/constants/route';

interface AvatarProfileProps {
  imageUrl: string;
  fallback: string;
  alt: string;
}

export const AvatarProfile = ({ imageUrl, fallback, alt }: AvatarProfileProps) => {
  const router = useRouter();
  const { signOut } = useClerk();

  const handleNavigateToSettings = () => {
    router.push(ROUTES.SETTING);
  };

  const handleLogout = async () => {
    await signOut({ redirectUrl: ROUTES.HOME });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full">
          <Avatar className="w-10 h-10 md:w-[60px] md:h-[60px] cursor-pointer hover:opacity-80 transition-opacity">
            {imageUrl ? (
              <AvatarImage
                src={imageUrl}
                alt={alt}
                unoptimized={imageUrl.includes('localhost') || imageUrl.includes('127.0.0.1')}
              />
            ) : null}
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm md:text-lg">
              {fallback}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-white shadow-lg border border-neutral-10">
        <DropdownMenuItem
          onClick={handleNavigateToSettings}
          className="cursor-pointer gap-3 py-2.5 px-3 hover:bg-neutral-10 focus:bg-neutral-10 transition-colors"
        >
          <SettingIcon className="w-4 h-4 text-neutral-30" />
          <span className="text-tx-primary">Setting</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer gap-3 py-2.5 px-3 hover:bg-red-50 focus:bg-red-50 text-red-600 focus:text-red-600 transition-colors"
        >
          <SignoutIcon className="w-4 h-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
