'use client';

// Libraries
import Link from 'next/link';

// Components
import { SignIn } from '@clerk/nextjs';
import { Icons } from '@/components/Icons/Icons';
import { CreditCard } from '@/components/CreditCard';

export const SignInPageWrapper = () => {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      {/* Left: Branding Panel */}
      <div className="hidden lg:flex flex-col p-12 bg-gradient-to-br from-blue-50 to-blue-70 relative overflow-hidden">
        {/* Decorative background circles */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute -top-20 left-40 w-48 h-48 rounded-full bg-white/5" />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 relative z-10">
          <div className="bg-white rounded-xl p-1.5">
            <Icons.Logo />
          </div>
          <span className="text-2xl font-black text-white">BankDash.</span>
        </Link>

        {/* Tagline */}
        <div className="flex-1 flex flex-col justify-center relative z-10">
          <h1 className="text-[40px] font-bold text-white leading-tight mb-4">
            Manage your finances
            <br />
            with confidence
          </h1>
          <p className="text-white/70 text-lg">
            Secure, smart and seamless banking
            <br />
            at your fingertips.
          </p>
        </div>

        {/* Decorative Credit Card */}
        <div className="relative z-10 mb-8 transform -rotate-6 -translate-x-4">
          <CreditCard
            balance="5,756"
            cardHolder="John Smith"
            cardNumber="3778124534541234"
            expiration="2028-12-31"
            variant="white"
          />
        </div>
      </div>

      {/* Right: Sign In Form */}
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-background">
        {/* Mobile logo — only shown on small screens */}
        <Link href="/" className="lg:hidden flex items-center gap-3 mb-8">
          <Icons.Logo />
          <span className="text-2xl font-black text-tx-primary">BankDash.</span>
        </Link>

        <SignIn signUpUrl="/sign-up" fallbackRedirectUrl="/dashboard" />
      </div>
    </div>
  );
};
