"use client";

import { useMemo } from "react";
import { useTransactions } from "./use-transactions";
import { getCurrentTaxYear, getTaxYearById, TAX_YEARS } from "@/lib/constants";
import type { AllowanceStatus, Contribution } from "@/types";

export function useAllowance(taxYearId?: string) {
  const { transactions } = useTransactions();

  const allowanceStatus: AllowanceStatus = useMemo(() => {
    const taxYear = taxYearId ? getTaxYearById(taxYearId) : getCurrentTaxYear();
    if (!taxYear) {
      return {
        taxYear: getCurrentTaxYear(),
        totalDeposited: 0,
        remaining: getCurrentTaxYear().allowance,
        percentUsed: 0,
        contributions: [],
      };
    }

    const deposits = transactions
      .filter((t) => t.taxYear === taxYear.id && t.type === "DEPOSIT")
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let runningTotal = 0;
    const contributions: Contribution[] = deposits.map((d) => {
      runningTotal += d.amount;
      return {
        date: d.date,
        amount: d.amount,
        runningTotal,
      };
    });

    const totalDeposited = deposits.reduce((sum, d) => sum + d.amount, 0);
    const remaining = Math.max(0, taxYear.allowance - totalDeposited);
    const percentUsed = (totalDeposited / taxYear.allowance) * 100;

    return {
      taxYear,
      totalDeposited,
      remaining,
      percentUsed: Math.min(100, percentUsed),
      contributions,
    };
  }, [transactions, taxYearId]);

  return {
    ...allowanceStatus,
    taxYears: TAX_YEARS,
  };
}
