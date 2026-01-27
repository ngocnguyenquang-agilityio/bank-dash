import * as React from "react";

export type ChartConfig = Record<string, { label: string; color: string }>;

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig;
}

export function ChartContainer({
  config,
  className,
  children,
  ...props
}: ChartContainerProps) {
  const styleVars: React.CSSProperties & Record<string, string> =
    {} as React.CSSProperties & Record<string, string>;
  for (const [key, value] of Object.entries(config)) {
    styleVars[`--color-${key}`] = value.color;
  }
  return (
    <div className={className} style={styleVars} {...props}>
      {children}
    </div>
  );
}
