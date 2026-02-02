'use client';

// Libraries
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Utils
import { cn } from '@/lib/utils';

// Components
import { Button } from '@/components/ui/button';

// Icons
import {
  HomeIcon,
  CreditCardIcon,
  ArrowLeftRightIcon,
  LineChartIcon,
  BadgeDollarSignIcon,
  LifeBuoyIcon,
  Settings2Icon,
  AwardIcon,
  BuildingIcon,
  MenuIcon,
  XIcon,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

const menuItems = [
  { icon: HomeIcon, label: 'Dashboard', href: '/dashboard' },
  { icon: ArrowLeftRightIcon, label: 'Transactions', href: '/transactions' },
  { icon: BuildingIcon, label: 'Accounts', href: '/accounts' },
  { icon: LineChartIcon, label: 'Investments', href: '/investments' },
  { icon: CreditCardIcon, label: 'Cards', href: '/cards' },
  { icon: BadgeDollarSignIcon, label: 'Loans', href: '/loans' },
  { icon: LifeBuoyIcon, label: 'Services', href: '/services' },
  { icon: AwardIcon, label: 'My Privileges', href: '/privileges' },
  { icon: Settings2Icon, label: 'Setting', href: '/settings' },
];

export const Sidebar = ({ className }: SidebarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        variant="ghost"
        size="md"
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 px-0 bg-white rounded-lg shadow-md flex items-center justify-center"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <XIcon className="w-6 h-6 text-tx-primary" />
        ) : (
          <MenuIcon className="w-6 h-6 text-tx-primary" />
        )}
      </Button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'w-[250px] bg-white border-r border-neutral-20 transition-transform duration-300 ease-in-out',
          'fixed lg:sticky top-0 h-screen z-40',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-6 sm:px-9 py-6 sm:py-8">
            <Link href="/dashboard" className="flex items-center gap-3 cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold">
                B
              </div>
              <span className="text-xl sm:text-2xl font-black text-tx-primary">BankDash.</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-4 sm:gap-6 px-4 sm:px-7 py-3 sm:py-4 rounded-r-[10px] text-base sm:text-[18px] font-medium transition-colors relative',
                        isActive ? 'text-blue-30' : 'text-neutral-30 hover:text-tx-primary'
                      )}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-30 rounded-r-[10px]" />
                      )}
                      <item.icon
                        className={cn('w-6 h-6', isActive ? 'text-blue-30' : 'text-neutral-30')}
                      />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};
