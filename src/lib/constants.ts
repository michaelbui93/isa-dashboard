import type { TaxYear } from "@/types";

export const ISA_ANNUAL_ALLOWANCE = 2000000; // £20,000 in pence

export const TAX_YEARS: TaxYear[] = [
  {
    id: "2024/25",
    startDate: "2024-04-06",
    endDate: "2025-04-05",
    allowance: ISA_ANNUAL_ALLOWANCE,
  },
  {
    id: "2025/26",
    startDate: "2025-04-06",
    endDate: "2026-04-05",
    allowance: ISA_ANNUAL_ALLOWANCE,
  },
  {
    id: "2023/24",
    startDate: "2023-04-06",
    endDate: "2024-04-05",
    allowance: ISA_ANNUAL_ALLOWANCE,
  },
];

export function getCurrentTaxYear(): TaxYear {
  const now = new Date();
  const taxYear = TAX_YEARS.find((ty) => {
    const start = new Date(ty.startDate);
    const end = new Date(ty.endDate);
    return now >= start && now <= end;
  });
  return taxYear || TAX_YEARS[0];
}

export function getTaxYearById(id: string): TaxYear | undefined {
  return TAX_YEARS.find((ty) => ty.id === id);
}

export const TRANSACTION_TYPE_LABELS: Record<string, string> = {
  DEPOSIT: "Deposit",
  WITHDRAWAL: "Withdrawal",
  BUY: "Buy",
  SELL: "Sell",
  DIVIDEND: "Dividend",
  FEE: "Fee",
};

export const FUND_CATEGORY_LABELS: Record<string, string> = {
  "US Equity": "US Equity",
  "Global Equity": "Global Equity",
  "UK Equity": "UK Equity",
  "Emerging Markets": "Emerging Markets",
  Bonds: "Bonds",
  "Mixed Assets": "Mixed Assets",
  "Sector - Technology": "Technology",
  "Sector - Healthcare": "Healthcare",
};

export const RISK_LEVEL_LABELS: Record<number, string> = {
  1: "Very Low",
  2: "Low",
  3: "Medium",
  4: "High",
  5: "Very High",
};

export const STORAGE_KEYS = {
  PORTFOLIO: "isa-dashboard-portfolio",
  TRANSACTIONS: "isa-dashboard-transactions",
  THEME: "isa-dashboard-theme",
} as const;
