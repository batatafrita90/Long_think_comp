'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type ProgressProps = {
  value?: number;
  className?: string;
};

export const Progress = ({ value = 0, className }: ProgressProps) => (
  <div
    role="progressbar"
    aria-valuenow={value}
    aria-valuemin={0}
    aria-valuemax={100}
    className={cn(
      'relative h-2 w-full overflow-hidden rounded-full bg-neutral-200',
      className,
    )}
  >
    <div
      className="h-full w-full origin-left bg-neutral-900 transition-transform duration-300"
      style={{ transform: `scaleX(${Math.min(Math.max(value, 0), 100) / 100})` }}
    />
  </div>
);
