"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CurrencyDisplay } from "@/components/shared/currency-display";
import { formatDate, formatShares } from "@/lib/formatters";
import { TRANSACTION_TYPE_LABELS } from "@/lib/constants";
import type { Transaction } from "@/types";

interface TransactionTableProps {
  transactions: Transaction[];
}

const typeBadgeColors: Record<string, string> = {
  DEPOSIT: "bg-gain/20 text-gain border-gain/30",
  WITHDRAWAL: "bg-loss/20 text-loss border-loss/30",
  BUY: "bg-primary/20 text-primary border-primary/30",
  SELL: "bg-orange-500/20 text-orange-500 border-orange-500/30",
  DIVIDEND: "bg-purple-500/20 text-purple-500 border-purple-500/30",
  FEE: "bg-muted text-muted-foreground border-border",
};

export function TransactionTable({ transactions }: TransactionTableProps) {
  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No transactions yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop table */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Fund</TableHead>
                <TableHead className="text-right">Shares</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {formatDate(transaction.date, "dd MMM yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={typeBadgeColors[transaction.type]}
                    >
                      {TRANSACTION_TYPE_LABELS[transaction.type]}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {transaction.description}
                  </TableCell>
                  <TableCell>{transaction.fundSymbol || "-"}</TableCell>
                  <TableCell className="text-right">
                    {transaction.shares ? formatShares(transaction.shares) : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <CurrencyDisplay
                      amount={transaction.amount}
                      colorCode={
                        transaction.type === "DEPOSIT" ||
                        transaction.type === "DIVIDEND" ||
                        transaction.type === "SELL"
                      }
                      showSign={
                        transaction.type === "DEPOSIT" ||
                        transaction.type === "DIVIDEND"
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="p-4 rounded-lg bg-muted/50 space-y-2"
            >
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className={typeBadgeColors[transaction.type]}
                >
                  {TRANSACTION_TYPE_LABELS[transaction.type]}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {formatDate(transaction.date, "dd MMM")}
                </span>
              </div>
              <p className="text-sm">{transaction.description}</p>
              <div className="flex items-center justify-between">
                {transaction.fundSymbol && (
                  <span className="text-sm font-medium">
                    {transaction.fundSymbol}
                    {transaction.shares && ` x ${formatShares(transaction.shares)}`}
                  </span>
                )}
                <CurrencyDisplay
                  amount={transaction.amount}
                  className="font-semibold"
                  colorCode={
                    transaction.type === "DEPOSIT" ||
                    transaction.type === "DIVIDEND"
                  }
                  showSign={
                    transaction.type === "DEPOSIT" ||
                    transaction.type === "DIVIDEND"
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
