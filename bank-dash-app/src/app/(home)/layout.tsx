// Libraries
import { type ReactNode } from 'react';
import { redirect } from 'next/navigation';

// Utils
import { getAuth } from '@/lib/auth';

// Services
import { getMemberByClerkId } from '@/services/members';

// Components
import { Sidebar } from '@/components/Sidebar';
import { DashboardHeaderContent } from '@/components/DashboardHeader';
import { MemberStoreHydrator } from '@/stores/member';

// Constants
import { ROUTES } from '@/constants/route';

type HomeLayoutProps = {
  children: ReactNode;
};

const HomeLayout = async ({ children }: HomeLayoutProps) => {
  const { userId } = await getAuth();

  if (!userId) {
    redirect(ROUTES.SIGN_IN);
  }

  const { member } = await getMemberByClerkId(userId);

  return (
    <div className="h-screen overflow-hidden lg:grid lg:grid-cols-[250px_1fr] bg-background">
      <Sidebar />
      <MemberStoreHydrator initialMember={member} />
      <div className="flex flex-col h-screen overflow-hidden">
        <DashboardHeaderContent />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:px-10 md:py-6">{children}</main>
      </div>
    </div>
  );
};

export default HomeLayout;
