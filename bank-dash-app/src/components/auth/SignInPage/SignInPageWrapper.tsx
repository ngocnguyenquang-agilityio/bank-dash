'use client';

import { Button } from '@/components/ui/button';
import { SignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export const SignInPageWrapper = () => {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <SignIn signUpUrl="/sign-up" fallbackRedirectUrl="/dashboard" />
      <Button
        className="bg-accent hover:opacity-80 hover:bg-accent px-10 w-full"
        onClick={handleBackToHome}
      >
        Back to Home
      </Button>
    </div>
  );
};
