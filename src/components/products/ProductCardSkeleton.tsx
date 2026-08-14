'use client';

import * as React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function ProductCardSkeleton() {
  return (
    <div className="bg-card border border-border/70 rounded-xl flex flex-col h-full overflow-hidden p-0 relative shadow-sm">
      {/* Image Skeleton with Price Badge Placeholder */}
      <div className="w-full h-56 bg-slate-900/60 relative overflow-hidden shrink-0 border-b border-border/50 flex items-center justify-center p-4">
        <Skeleton variant="rectangular" className="w-full h-full rounded-lg bg-slate-800/40" />
        <div className="absolute top-4 right-4 z-10">
          <Skeleton className="h-7 w-20 rounded-lg bg-slate-800/80" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Category & Badge Line */}
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-4 w-24 rounded bg-slate-800/60" />
          <Skeleton className="h-5 w-28 rounded bg-slate-800/50" />
        </div>

        {/* Title */}
        <Skeleton className="h-6 w-3/4 rounded mb-2.5 bg-slate-700/50" />

        {/* Short Description */}
        <div className="space-y-1.5 mb-6">
          <Skeleton className="h-3.5 w-full rounded bg-slate-800/40" />
          <Skeleton className="h-3.5 w-5/6 rounded bg-slate-800/40" />
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-4 border-t border-border/40">
          <Skeleton className="h-10 w-full rounded-md bg-slate-800/70" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </>
  );
}
