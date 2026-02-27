'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';

const data = [
  { month: 'Jul', balance: 200 },
  { month: 'Aug', balance: 420 },
  { month: 'Sep', balance: 250 },
  { month: 'Oct', balance: 620 },
  { month: 'Nov', balance: 380 },
  { month: 'Dec', balance: 720 },
  { month: 'Jan', balance: 520 },
];

const chartConfig = {
  balance: {
    label: 'Balance',
    color: 'var(--color-blue-50)',
  },
} satisfies ChartConfig;

export const BalanceHistory = () => {
  return (
    <Card className="w-full min-h-[276px] flex-1 rounded-[25px] border-0 outline-none shadow-none">
      <CardContent className="px-5 py-6">
        <div className="h-[220px]">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-blue-30)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-blue-30)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="4 4"
                  stroke="var(--color-neutral-20)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'var(--color-neutral-30)', fontSize: 14 }}
                  stroke="var(--color-neutral-30)"
                  dy={10}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'var(--color-neutral-30)', fontSize: 13 }}
                  ticks={[0, 200, 400, 600, 800]}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="var(--color-blue-50)"
                  strokeWidth={3}
                  fill="url(#balanceGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};
