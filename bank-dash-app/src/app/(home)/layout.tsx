// Libraries
import { type ReactNode, Suspense } from 'react';
import { redirect } from 'next/navigation';

// Utils
import { getAuth } from '@/lib/auth';

// Components
import { Sidebar } from '@/components/Sidebar';
import { DashboardHeader } from '@/components/DashboardHeader';

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

  return (
    <div className="h-screen overflow-hidden lg:grid lg:grid-cols-[250px_1fr] bg-background">
      <Sidebar />
      <div className="flex flex-col h-screen overflow-hidden">
        <Suspense
          fallback={
            <div className="h-16 sm:h-20 md:h-[100px] bg-white border-b border-neutral-10" />
          }
        >
          <DashboardHeader />
        </Suspense>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:px-10 md:py-6">{children}</main>
      </div>
    </div>
  );
};

export default HomeLayout;
