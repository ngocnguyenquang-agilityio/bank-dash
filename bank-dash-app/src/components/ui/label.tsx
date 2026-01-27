import * as React from "react";
import { cn } from "@/lib/utils";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label = ({ className, ...props }: LabelProps) => {
  return (
    <label
      className={cn("text-sm font-medium text-[#718EBF]", className)}
      {...props}
    />
  );
};
