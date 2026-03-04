export interface TaxYear {
  id: string;
  startDate: string;
  endDate: string;
  allowance: number;
}

export interface Contribution {
  date: string;
  amount: number;
  runningTotal: number;
}

export interface AllowanceStatus {
  taxYear: TaxYear;
  totalDeposited: number;
  remaining: number;
  percentUsed: number;
  contributions: Contribution[];
}
