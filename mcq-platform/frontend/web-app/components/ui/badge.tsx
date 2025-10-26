'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: 'default' | 'success' | 'warning' | 'danger';
};

const styles: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-neutral-900 text-white',
  success: 'bg-emerald-500 text-white',
  warning: 'bg-amber-500 text-neutral-900',
  danger: 'bg-red-500 text-white',
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide',
        styles[variant],
        className,
      )}
      {...props}
    />
  ),
);
Badge.displayName = 'Badge';
