"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function PortfolioHeroSkeleton() {
  return (
    <div className="space-y-3 py-2">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-12 w-64" />
      <Skeleton className="h-5 w-48" />
    </div>
  );
}

export function PortfolioSummarySkeleton() {
  return (
    <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <div className="md:col-span-2 rounded-2xl bg-muted h-32 animate-pulse" />
      <div className="rounded-2xl bg-muted h-32 animate-pulse" />
      <div className="rounded-2xl bg-muted h-32 animate-pulse" />
      <div className="md:col-span-2 lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl bg-muted h-16 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export function HoldingsTableSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-24" />
      </CardHeader>
      <CardContent className="space-y-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between py-2">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-32" />
            </div>
            <div className="text-right space-y-1.5">
              <Skeleton className="h-4 w-20 ml-auto" />
              <Skeleton className="h-3 w-12 ml-auto" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function AllowanceGaugeSkeleton() {
  return (
    <Card>
      <CardContent className="p-6 flex flex-col items-center gap-4">
        <div className="h-36 w-36 rounded-full bg-muted animate-pulse" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </CardContent>
    </Card>
  );
}

export function PerformanceChartSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-44" />
      </CardHeader>
      <CardContent>
        <div className="h-[300px] rounded-xl bg-muted relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-foreground/5 before:to-transparent before:[animation:shimmer_1.5s_infinite]" />
      </CardContent>
    </Card>
  );
}

export function BenchmarkDeltaSkeleton() {
  return (
    <Card>
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-3 w-28" />
        </div>
        <div className="text-right space-y-3">
          <div className="space-y-1">
            <Skeleton className="h-3 w-16 ml-auto" />
            <Skeleton className="h-4 w-12 ml-auto" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-3 w-20 ml-auto" />
            <Skeleton className="h-4 w-12 ml-auto" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function GainsSummarySkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-36" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[0, 1].map((i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-28" />
            </div>
            <Skeleton className="h-5 w-16" />
          </div>
        ))}
        <div className="grid grid-cols-2 gap-4 pt-2">
          {[0, 1].map((i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function TransactionTableSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent className="space-y-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-32" />
            </div>
            <div className="text-right space-y-1.5">
              <Skeleton className="h-4 w-16 ml-auto" />
              <Skeleton className="h-3 w-12 ml-auto" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function FundCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-3 w-36" />
          </div>
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}
