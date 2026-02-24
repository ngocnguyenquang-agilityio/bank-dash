// Libraries
import Link from 'next/link';

// Icons
import { Construction } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';

// Utils
import { createMetadata } from '@/utils';

export const metadata = createMetadata('Accounts');

const AccountsPage = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
    <div className="w-20 h-20 rounded-full bg-blue-10 flex items-center justify-center">
      <Construction className="w-10 h-10 text-blue-50" />
    </div>

    <div className="space-y-2">
      <h2 className="text-2xl sm:text-3xl font-semibold text-tx-primary">Page not available</h2>
      <p className="text-base sm:text-lg text-neutral-30 max-w-md">
        This will be implemented in the future
      </p>
    </div>

    <Link href="/dashboard">
      <Button className="h-[50px] px-8 rounded-[15px] bg-blue-50 text-white text-base font-medium hover:bg-blue-60 transition-colors">
        Back to Dashboard
      </Button>
    </Link>
  </div>
);

export default AccountsPage;
