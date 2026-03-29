"use client";

import { PageTransition } from "@/components/layout/page-transition";
import { Header } from "@/components/layout/header";
import { AllowanceGauge } from "@/components/allowance/allowance-gauge";
import { AllowanceSummary } from "@/components/allowance/allowance-summary";
import { ContributionHistory } from "@/components/allowance/contribution-history";
import { PacingSignal } from "@/components/allowance/pacing-signal";
import { AllowanceGaugeSkeleton } from "@/components/skeletons/portfolio-skeletons";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAllowance } from "@/hooks/use-allowance";
import { useLoadingState } from "@/hooks/use-loading-state";

export default function AllowancePage() {
  const { taxYear, totalDeposited, remaining, percentUsed, contributions } = useAllowance();
  const loading = useLoadingState(500);

  return (
    <PageTransition>
      <>
        <Header title="ISA Allowance" />
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          {loading ? (
            <>
              <div className="grid gap-4 md:gap-6 md:grid-cols-2">
                <AllowanceGaugeSkeleton />
                <Card>
                  <CardContent className="p-6 space-y-3">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="flex justify-between">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
              <Skeleton className="h-16 w-full rounded-xl" />
              <Card>
                <CardHeader><Skeleton className="h-5 w-40" /></CardHeader>
                <CardContent className="space-y-4">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="space-y-4 md:space-y-6 transition-opacity duration-300">
              <div className="grid gap-4 md:gap-6 md:grid-cols-2">
                <AllowanceGauge used={totalDeposited} total={taxYear.allowance} percentUsed={percentUsed} />
                <AllowanceSummary taxYear={taxYear} deposited={totalDeposited} remaining={remaining} percentUsed={percentUsed} />
              </div>
              <PacingSignal taxYear={taxYear} totalDeposited={totalDeposited} />
              <ContributionHistory contributions={contributions} />
            </div>
          )}
        </div>
      </>
    </PageTransition>
  );
}
