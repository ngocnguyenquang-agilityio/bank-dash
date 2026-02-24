'use client';

// Libraries
import { useRouter } from 'next/navigation';

// Components
import { Button } from '@/components/ui/button';
import { FeatureCard } from '@/components/FeatureCard/FeatureCard';
import { Icons } from '@/components/Icons/Icons';

// Constants
import { ROUTES } from '@/constants/route';

export const HomePageWrapper = () => {
  const router = useRouter();

  const handleNavigateSignIn = () => {
    router.push(ROUTES.SIGN_IN);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icons.Logo />
            <span className="text-xl font-bold text-tx-primary">Bank Dash</span>
          </div>
          <Button onClick={handleNavigateSignIn} className="rounded-full px-6 font-medium">
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-tx-primary leading-tight">
            Smart Banking for the <span className="text-blue-60">Modern Era</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience seamless financial management with Bank Dash. Track cards, monitor
            transactions, and analyze your spending habits all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              onClick={handleNavigateSignIn}
              className="rounded-full px-8 text-lg h-12 shadow-lg hover:shadow-xl transition-all"
            >
              Get Started Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 text-lg h-12 border-2 hover:bg-slate-50"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-white py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-tx-primary">Everything you need</h2>
            <p className="text-muted-foreground text-lg">
              Powerful features to help you grow your wealth
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard
              icon={<Icons.CreditCard className="w-8 h-8 text-blue-60" />}
              title="Card Management"
              description="Manage multiple cards, view details, and track spending limits with ease."
            />
            <FeatureCard
              icon={<Icons.Transfer className="w-8 h-8 text-green-60" />}
              title="Quick Transfers"
              description="Send money instantly to friends and family with our secure transfer system."
            />
            <FeatureCard
              icon={<Icons.History className="w-8 h-8 text-yellow-60" />}
              title="History & Analytics"
              description="Visualized spending history and weekly activity reports to keep you on track."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-tx-primary text-white py-12 px-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Icons.CreditCard className="w-6 h-6" />
            <span className="text-xl font-bold">Bank Dash</span>
          </div>
          <p className="text-slate-300 text-sm">
            © {new Date().getFullYear()} Bank Dash. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
