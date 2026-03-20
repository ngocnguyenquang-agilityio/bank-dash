import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Avatar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
      {...props}
    />
  );
}

export function AvatarImage({
  className,
  alt = '',
  onError,
  ...props
}: React.ComponentProps<typeof Image>) {
  const [hasError, setHasError] = React.useState(false);

  if (hasError) return null;

  return (
    <Image
      className={cn('object-cover', className)}
      alt={alt}
      fill
      sizes="40px"
      onError={(e) => {
        setHasError(true);
        onError?.(e);
      }}
      {...props}
    />
  );
}

export function AvatarFallback({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'flex h-full w-full items-center justify-center bg-muted text-foreground',
        className,
      )}
      {...props}
    />
  );
}
