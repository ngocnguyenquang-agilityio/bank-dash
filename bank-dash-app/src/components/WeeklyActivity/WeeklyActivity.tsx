"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const data = [
  { day: "Sat", deposit: 480, withdraw: 320 },
  { day: "Sun", deposit: 350, withdraw: 240 },
  { day: "Mon", deposit: 320, withdraw: 380 },
  { day: "Tue", deposit: 480, withdraw: 220 },
  { day: "Wed", deposit: 240, withdraw: 360 },
  { day: "Thu", deposit: 380, withdraw: 450 },
  { day: "Fri", deposit: 400, withdraw: 320 },
];

const chartConfig = {
  deposit: {
    label: "Deposit",
    color: "var(--color-blue-50)",
  },
  withdraw: {
    label: "Withdraw",
    color: "var(--color-red-50)",
  },
} satisfies ChartConfig;

export const WeeklyActivity = () => {
  return (
    <Card className="w-full rounded-[25px] border-0 outline-none shadow-none">
      <CardContent className="pt-6">
        <div className="h-[180px] sm:h-[200px] md:h-[226px]">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} barGap={8}>
                <CartesianGrid
                  strokeDasharray="0"
                  stroke="var(--color-neutral-10)"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--color-neutral-30)", fontSize: 13 }}
                  dy={10}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--color-neutral-30)", fontSize: 13 }}
                  ticks={[0, 100, 200, 300, 400, 500]}
                />
                <Bar
                  dataKey="deposit"
                  fill="var(--color-deposit)"
                  radius={[10, 10, 10, 10]}
                  barSize={15}
                />
                <Bar
                  dataKey="withdraw"
                  fill="var(--color-withdraw)"
                  radius={[10, 10, 10, 10]}
                  barSize={15}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center sm:justify-end gap-4 sm:gap-6 md:gap-8 mt-4 sm:mt-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-blue-50" />
            <span className="text-xs sm:text-sm md:text-[15px] text-neutral-30">
              Deposit
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-red-50" />
            <span className="text-xs sm:text-sm md:text-[15px] text-neutral-30">
              Withdraw
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
