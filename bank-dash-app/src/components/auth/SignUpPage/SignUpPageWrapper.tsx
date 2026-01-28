'use client';

// Libraries
import { useRouter } from 'next/navigation';

// Components
import { SignUp } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

export const SignUpPageWrapper = () => {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <SignUp
        signInUrl="/sign-in"
        forceRedirectUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL}
      />
      <Button
        className="bg-accent hover:opacity-80 hover:bg-accent px-10 w-full"
        onClick={handleBackToHome}
      >
        Back to Home
      </Button>
    </div>
  );
};
