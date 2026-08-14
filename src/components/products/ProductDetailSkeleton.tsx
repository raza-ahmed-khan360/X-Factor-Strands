'use client';

import * as React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { ProductCardSkeleton } from './ProductCardSkeleton';

export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Breadcrumb Back Link */}
          <div className="mb-8">
            <Skeleton className="h-4 w-36 rounded bg-slate-800/60" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Column: Product Image Aspect Square */}
            <div className="bg-card border border-border rounded-2xl aspect-square flex items-center justify-center p-8 relative overflow-hidden">
              <Skeleton variant="rounded" className="w-full h-full rounded-xl bg-slate-800/50" />
              <div className="absolute bottom-6 left-6 right-6 flex justify-between">
                <Skeleton className="h-6 w-20 rounded bg-slate-900/80" />
                <Skeleton className="h-6 w-24 rounded bg-slate-900/80" />
              </div>
            </div>

            {/* Right Column: Info & Actions */}
            <div className="flex flex-col">
              {/* Category & Stars */}
              <div className="flex items-center gap-4 mb-3">
                <Skeleton className="h-5 w-32 rounded bg-slate-800/60" />
                <Skeleton className="h-4 w-24 rounded bg-slate-800/50" />
              </div>

              {/* Product Title */}
              <Skeleton className="h-10 w-4/5 rounded mb-4 bg-slate-700/60" />

              {/* Price */}
              <Skeleton className="h-8 w-28 rounded mb-6 bg-slate-800/70" />

              {/* Size Selectors */}
              <div className="mb-6">
                <Skeleton className="h-4 w-20 rounded mb-2.5 bg-slate-800/50" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-16 rounded-md bg-slate-800/70" />
                  <Skeleton className="h-9 w-16 rounded-md bg-slate-800/70" />
                  <Skeleton className="h-9 w-16 rounded-md bg-slate-800/70" />
                </div>
              </div>

              {/* Description Paragraphs */}
              <div className="border-b border-border/50 pb-8 mb-8 space-y-2.5">
                <Skeleton className="h-4 w-full rounded bg-slate-800/50" />
                <Skeleton className="h-4 w-11/12 rounded bg-slate-800/50" />
                <Skeleton className="h-4 w-3/4 rounded bg-slate-800/50" />
              </div>

              {/* Specs Grid */}
              <div className="mb-8">
                <Skeleton className="h-5 w-40 rounded mb-4 bg-slate-800/60" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-16 rounded-lg bg-slate-800/40 border border-border" />
                  <Skeleton className="h-16 rounded-lg bg-slate-800/40 border border-border" />
                  <Skeleton className="h-16 rounded-lg bg-slate-800/40 border border-border" />
                  <Skeleton className="h-16 rounded-lg bg-slate-800/40 border border-border" />
                </div>
              </div>

              {/* Add to Cart Button */}
              <Skeleton className="h-14 w-full rounded-xl bg-slate-700/60 shadow-lg" />
            </div>
          </div>

          {/* Related Products Skeleton */}
          <div className="mt-24 pt-12 border-t border-border">
            <Skeleton className="h-8 w-60 rounded mb-8 bg-slate-800/60" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
