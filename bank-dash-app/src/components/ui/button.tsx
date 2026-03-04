import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const variants = {
      default: 'bg-blue-50 text-white hover:bg-blue-60',
      outline: 'border border-gray-300 bg-white text-black hover:bg-gray-50',
      ghost: 'bg-transparent text-tx-primary hover:bg-white hover:text-tx-primary',
    } as const;
    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-11 px-6 text-base',
      icon: 'h-8 w-8',
    } as const;
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md transition-colors cursor-pointer',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';
