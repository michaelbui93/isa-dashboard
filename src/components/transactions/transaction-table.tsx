"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BottomSheet } from "@/components/ui/bottom-sheet";
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

function TransactionDetail({ tx }: { tx: Transaction }) {
  return (
    <div className="space-y-3 text-sm">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Date</span>
        <span className="font-medium">{formatDate(tx.date, "dd MMM yyyy")}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Type</span>
        <Badge variant="outline" className={typeBadgeColors[tx.type]}>
          {TRANSACTION_TYPE_LABELS[tx.type]}
        </Badge>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Description</span>
        <span className="font-medium text-right max-w-[60%]">{tx.description}</span>
      </div>
      {tx.fundSymbol && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Fund</span>
          <span className="font-medium">{tx.fundSymbol}</span>
        </div>
      )}
      {tx.shares && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shares</span>
          <span className="font-financial font-medium">{formatShares(tx.shares)}</span>
        </div>
      )}
      {tx.pricePerShare && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Price/share</span>
          <CurrencyDisplay amount={tx.pricePerShare} className="font-financial font-medium" />
        </div>
      )}
      <div className="flex justify-between border-t border-border/50 pt-3">
        <span className="text-muted-foreground font-medium">Amount</span>
        <CurrencyDisplay
          amount={tx.amount}
          className="font-financial font-semibold text-base"
          colorCode={tx.type === "DEPOSIT" || tx.type === "DIVIDEND"}
          showSign={tx.type === "DEPOSIT" || tx.type === "DIVIDEND"}
        />
      </div>
    </div>
  );
}

function MobileTransactionCard({ transaction }: { transaction: Transaction }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  return (
    <>
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={() => setSheetOpen(true)}
        className="p-4 rounded-xl bg-muted/50 space-y-2 cursor-pointer active:bg-muted/70 transition-colors"
      >
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={typeBadgeColors[transaction.type]}>
            {TRANSACTION_TYPE_LABELS[transaction.type]}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {formatDate(transaction.date, "dd MMM")}
          </span>
        </div>
        <p className="text-sm">{transaction.description}</p>
        <div className="flex items-center justify-between">
          {transaction.fundSymbol ? (
            <span className="text-sm font-medium">
              {transaction.fundSymbol}
              {transaction.shares && ` × ${formatShares(transaction.shares)}`}
            </span>
          ) : <span />}
          <CurrencyDisplay
            amount={transaction.amount}
            className="font-semibold font-financial"
            colorCode={transaction.type === "DEPOSIT" || transaction.type === "DIVIDEND"}
            showSign={transaction.type === "DEPOSIT" || transaction.type === "DIVIDEND"}
          />
        </div>
      </motion.div>

      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={TRANSACTION_TYPE_LABELS[transaction.type]}
      >
        <TransactionDetail tx={transaction} />
      </BottomSheet>
    </>
  );
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>Transaction History</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No transactions yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader><CardTitle>Transaction History</CardTitle></CardHeader>
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
                    <Badge variant="outline" className={typeBadgeColors[transaction.type]}>
                      {TRANSACTION_TYPE_LABELS[transaction.type]}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{transaction.description}</TableCell>
                  <TableCell>{transaction.fundSymbol || "—"}</TableCell>
                  <TableCell className="text-right font-financial">
                    {transaction.shares ? formatShares(transaction.shares) : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <CurrencyDisplay
                      amount={transaction.amount}
                      colorCode={transaction.type === "DEPOSIT" || transaction.type === "DIVIDEND" || transaction.type === "SELL"}
                      showSign={transaction.type === "DEPOSIT" || transaction.type === "DIVIDEND"}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile: tappable cards → bottom sheet */}
        <div className="md:hidden space-y-2">
          {transactions.map((transaction) => (
            <MobileTransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
