import { format, parseISO } from "date-fns";

export function formatCurrency(
  amountInPence: number,
  options?: { showSign?: boolean }
): string {
  const amount = amountInPence / 100;
  const formatted = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));

  if (options?.showSign && amountInPence !== 0) {
    return amountInPence > 0 ? `+${formatted}` : `-${formatted}`;
  }

  return amountInPence < 0 ? `-${formatted}` : formatted;
}

export function formatPercentage(
  value: number,
  options?: { showSign?: boolean; decimals?: number }
): string {
  const decimals = options?.decimals ?? 2;
  const formatted = Math.abs(value).toFixed(decimals);

  if (options?.showSign && value !== 0) {
    return value > 0 ? `+${formatted}%` : `-${formatted}%`;
  }

  return value < 0 ? `-${formatted}%` : `${formatted}%`;
}

export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat("en-GB", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatShares(shares: number): string {
  if (shares % 1 === 0) {
    return shares.toString();
  }
  return formatNumber(shares, 4);
}

export function formatDate(dateString: string, formatStr = "dd MMM yyyy"): string {
  return format(parseISO(dateString), formatStr);
}

export function formatDateShort(dateString: string): string {
  return format(parseISO(dateString), "dd/MM/yy");
}

export function formatDateTime(dateString: string): string {
  return format(parseISO(dateString), "dd MMM yyyy, HH:mm");
}

export function penceToDisplay(pence: number): number {
  return pence / 100;
}

export function displayToPence(display: number): number {
  return Math.round(display * 100);
}
