"use client";

import { Header } from "@/components/layout/header";
import { AllowanceGauge } from "@/components/allowance/allowance-gauge";
import { AllowanceSummary } from "@/components/allowance/allowance-summary";
import { ContributionHistory } from "@/components/allowance/contribution-history";
import { useAllowance } from "@/hooks/use-allowance";

export default function AllowancePage() {
  const { taxYear, totalDeposited, remaining, percentUsed, contributions } =
    useAllowance();

  return (
    <>
      <Header title="ISA Allowance" />
      <div className="p-6 space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <AllowanceGauge
            used={totalDeposited}
            total={taxYear.allowance}
            percentUsed={percentUsed}
          />
          <AllowanceSummary
            taxYear={taxYear}
            deposited={totalDeposited}
            remaining={remaining}
            percentUsed={percentUsed}
          />
        </div>

        <ContributionHistory contributions={contributions} />
      </div>
    </>
  );
}
