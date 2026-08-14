import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rectangular' | 'rounded' | 'circular';
  animation?: 'pulse' | 'wave' | false;
}

export function Skeleton({
  className,
  variant = 'rounded',
  animation = 'wave',
  ...props
}: SkeletonProps) {
  const variantClasses = {
    text: 'h-4 w-full rounded-sm',
    rectangular: 'rounded-none',
    rounded: 'rounded-xl',
    circular: 'rounded-full',
  }[variant];

  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative overflow-hidden bg-slate-800/50 border border-slate-700/20',
        animation === 'pulse' && 'animate-pulse',
        animation === 'wave' &&
          'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/[0.07] before:to-transparent',
        variantClasses,
        className
      )}
      {...props}
    />
  );
}
