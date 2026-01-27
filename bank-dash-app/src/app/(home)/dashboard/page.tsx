'use client';

import { CreditCard } from '@/components/CreditCard/index';
import { RecentTransactions } from '@/components/RecentTransactions';
import { WeeklyActivity } from '@/components/WeeklyActivity';
import { QuickTransfer } from '@/components/QuickTransfer';
import { BalanceHistory } from '@/components/BalanceHistory';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export const getTeamMembers = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const path = '/members';

  const url = `${baseUrl}${path}`;

  const res = await fetch(url);

  if (!res.ok) throw new Error('Failed to fetch team members');

  const data = await res.json();

  return data;
};

export default function HomePage() {
  const [teamMembers, setTeamMembers] = useState(null);

  useEffect(() => {
    getTeamMembers().then((data) => {
      setTeamMembers(data);
    });
  }, []);

  console.log('teamMembers', teamMembers);

  return (
    <main className="p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6 lg:gap-8 mb-6">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl md:text-[22px] font-semibold text-tx-primary">
              My Cards
            </h2>
            <Link
              href="/cards"
              className="text-sm sm:text-base md:text-[17px] font-semibold text-tx-primary hover:text-blue-50"
            >
              See All
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 overflow-x-auto pb-2 scrollbar-hide">
            <CreditCard
              balance="$5,756"
              cardHolder="Eddy Cusuma"
              cardNumber="3778 **** **** 1234"
              validThru="12/22"
            />
            <CreditCard
              balance="$5,756"
              cardHolder="Eddy Cusuma"
              cardNumber="3778 **** **** 1234"
              validThru="12/22"
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl md:text-[22px] font-semibold text-tx-primary">
            Recent Transaction
          </h2>
          <RecentTransactions />
        </section>
      </div>

      <section className="mb-6 space-y-4">
        <h2 className="text-lg sm:text-xl md:text-[22px] font-semibold text-tx-primary">
          Weekly Activity
        </h2>
        <WeeklyActivity />
      </section>

      <section className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
        <div className="flex flex-col space-y-4 lg:flex-1">
          <h2 className="text-lg sm:text-xl md:text-[22px] font-semibold text-tx-primary">
            Quick Transfer
          </h2>
          <QuickTransfer />
        </div>
        <div className="flex flex-col space-y-4 lg:flex-[2]">
          <h2 className="text-lg sm:text-xl md:text-[22px] font-semibold text-tx-primary">
            Balance History
          </h2>
          <BalanceHistory />
        </div>
      </section>
    </main>
  );
}
