"use client";

import { SearchIcon, Settings2Icon, BellIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";

interface DashboardHeaderProps {
  title?: string;
}

function toTitleCase(segment: string) {
  return segment
    .replace(/[-_]+/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export const DashboardHeader = ({ title }: DashboardHeaderProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const computedTitle = useMemo((): string => {
    const paramTitle = searchParams?.get("title");
    if (paramTitle && paramTitle.trim().length > 0) return paramTitle.trim();
    if (!pathname) return "Dashboard";
    const parts = pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1] ?? "";
    return parts.length === 0 ? "Dashboard" : toTitleCase(last);
  }, [pathname, searchParams]);

  const finalTitle = title ?? computedTitle;
  return (
    <header className="h-16 sm:h-20 md:h-[100px] bg-white border-b border-neutral-10 px-4 sm:px-6 md:px-10">
      <div className="h-full flex items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl md:text-[28px] font-semibold text-tx-primary lg:ml-0">
          {finalTitle}
        </h1>

        <div className="flex items-center gap-2 sm:gap-4 md:gap-8">
          {/* Search */}
          <div className="relative w-32 sm:w-48 md:w-[255px] hidden sm:block">
            <SearchIcon className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-neutral-30" />
            <Input
              placeholder="Search for something"
              className="pl-10 md:pl-14 h-10 md:h-[50px] rounded-[40px] bg-neutral-10 border-0 text-sm md:text-[15px] text-blue-10 placeholder:text-blue-10"
            />
          </div>

          {/* Settings Icon */}
          <Button
            variant="ghost"
            size="md"
            className="w-10 h-10 md:w-[50px] md:h-[50px] px-0 rounded-full bg-neutral-10 flex items-center justify-center hover:bg-gray-200 transition-colors"
            aria-label="Settings"
          >
            <Settings2Icon className="w-5 h-5 md:w-6 md:h-6 text-neutral-30" />
          </Button>

          {/* Notification Icon */}
          <Button
            variant="ghost"
            size="md"
            className="w-10 h-10 md:w-[50px] md:h-[50px] px-0 rounded-full bg-neutral-10 flex items-center justify-center hover:bg-gray-200 transition-colors relative"
            aria-label="Notifications"
          >
            <BellIcon className="w-5 h-5 md:w-6 md:h-6 text-neutral-30" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-60 rounded-full" />
          </Button>

          {/* Profile Avatar */}
          <Avatar className="w-10 h-10 md:w-[60px] md:h-[60px]">
            <AvatarImage
              src="https://i.pravatar.cc/150?u=eddy-cusuma"
              alt="Profile"
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm md:text-lg">
              EC
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};
