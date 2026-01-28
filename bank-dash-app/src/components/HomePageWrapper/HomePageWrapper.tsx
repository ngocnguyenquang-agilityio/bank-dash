'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export const HomePageWrapper = () => {
  const router = useRouter();
  const handleNavigateSignIn = () => {
    router.push('/sign-in');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 gap-4">
      <h1 className="text-3xl font-bold">Welcome to Bank Dash</h1>
      <p>Sign in to get started with managing your finances efficiently.</p>
      <div className="flex items-center gap-4">
        <Button
          className="bg-accent hover:opacity-80 hover:bg-accent px-10"
          onClick={handleNavigateSignIn}
        >
          Sign in
        </Button>
      </div>
    </main>
  );
};
