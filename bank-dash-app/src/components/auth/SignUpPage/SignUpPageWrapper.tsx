'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SignUp } from '@clerk/nextjs';

export const SignUpPageWrapper = () => {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <SignUp signInUrl="/sign-in" />
      <Button
        className="bg-accent hover:opacity-80 hover:bg-accent px-10 w-full"
        onClick={handleBackToHome}
      >
        Back to Home
      </Button>
    </div>
  );
};
