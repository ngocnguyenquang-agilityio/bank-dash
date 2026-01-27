import { type ReactNode, Suspense } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { DashboardHeader } from '@/components/DashboardHeader';

type HomeLayoutProps = {
  children: ReactNode;
};

const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[250px_1fr] bg-background">
      <Sidebar />
      <div className="flex flex-col min-h-screen">
        <Suspense
          fallback={
            <div className="h-16 sm:h-20 md:h-[100px] bg-white border-b border-neutral-10" />
          }
        >
          <DashboardHeader />
        </Suspense>
        <main className="p-4 sm:p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
};

export default HomeLayout;
