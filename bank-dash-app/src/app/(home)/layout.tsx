// Libraries
import { type ReactNode, Suspense } from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

// Components
import { Sidebar } from '@/components/Sidebar';
import { DashboardHeader } from '@/components/DashboardHeader';

// Services
import { getMemberByClerkId } from '@/services/members';

// Utils
import { getInitials, getStrapiMedia } from '@/utils';

// Constants
import { ROUTES } from '@/constants/route';

type HomeLayoutProps = {
  children: ReactNode;
};

const HomeLayout = async ({ children }: HomeLayoutProps) => {
  const { userId } = await auth();

  if (!userId) {
    redirect(ROUTES.SIGN_IN);
  }

  const { member } = await getMemberByClerkId(userId);

  const memberName = member?.name || 'User';
  const memberInitials = getInitials(memberName);
  const memberImageUrl = getStrapiMedia(member?.photo?.url) ?? '';

  return (
    <div className="h-screen overflow-hidden lg:grid lg:grid-cols-[250px_1fr] bg-background">
      <Sidebar />
      <div className="flex flex-col h-screen overflow-hidden">
        <Suspense
          fallback={
            <div className="h-16 sm:h-20 md:h-[100px] bg-white border-b border-neutral-10" />
          }
        >
          <DashboardHeader
            memberName={memberName}
            memberInitials={memberInitials}
            memberImageUrl={memberImageUrl}
          />
        </Suspense>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
};

export default HomeLayout;
