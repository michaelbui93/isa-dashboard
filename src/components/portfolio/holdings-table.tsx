"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { CurrencyDisplay } from "@/components/shared/currency-display";
import { PercentageChange } from "@/components/shared/percentage-change";
import { formatShares, formatCurrency } from "@/lib/formatters";
import type { HoldingWithDetails } from "@/types";

// ─── Drawdown badge ───────────────────────────────────────────────────────────
function DrawdownBadge({ value }: { value: number }) {
  const abs = Math.abs(value);
  const label = value === 0 ? "Peak" : `${value.toFixed(1)}%`;
  let classes =
    "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-financial font-medium";
  if (abs <= 5) classes += " bg-gain/15 text-gain";
  else if (abs <= 20) classes += " bg-amber-500/15 text-amber-500";
  else classes += " bg-loss/15 text-loss";
  return <span className={classes}>{label}</span>;
}

// ─── Sort types ───────────────────────────────────────────────────────────────
type SortKey = "fund" | "value" | "gainLossPercent" | "drawdownPercent" | "allocation";
type SortDir = "asc" | "desc";

function SortIcon({ col, active, dir }: { col: string; active: boolean; dir: SortDir }) {
  if (!active) return <ChevronsUpDown className="h-3.5 w-3.5 opacity-30 inline ml-1" />;
  return dir === "asc"
    ? <ChevronUp className="h-3.5 w-3.5 inline ml-1 text-primary" />
    : <ChevronDown className="h-3.5 w-3.5 inline ml-1 text-primary" />;
}

// ─── Expanded detail row ──────────────────────────────────────────────────────
function ExpandedDetail({ holding }: { holding: HoldingWithDetails }) {
  const invested = holding.shares * holding.averageCostPerShare;
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.22, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-4 py-3 bg-muted/30 rounded-xl mb-2 text-sm">
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Cost Basis</p>
          <p className="font-financial font-medium">{formatCurrency(holding.averageCostPerShare)}/share</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Total Invested</p>
          <p className="font-financial font-medium">{formatCurrency(invested)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Unrealised Gain</p>
          <p className={`font-financial font-medium ${holding.gainLoss >= 0 ? "text-gain" : "text-loss"}`}>
            {formatCurrency(holding.gainLoss, { showSign: true })}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Drawdown</p>
          <div className="flex items-center gap-1.5">
            <DrawdownBadge value={holding.drawdownPercent} />
            <span className="text-xs text-muted-foreground">from peak</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Mobile holding card ──────────────────────────────────────────────────────
function HoldingCard({ holding }: { holding: HoldingWithDetails }) {
  const [expanded, setExpanded] = useState(false);
  const hasDrawdown = Math.abs(holding.drawdownPercent) > 20;

  return (
    <div
      className={[
        "rounded-xl border bg-card transition-shadow",
        hasDrawdown ? "shadow-[0_0_0_1px_hsl(var(--loss)/0.3),0_0_12px_hsl(var(--loss)/0.08)]" : "border-border/50",
      ].join(" ")}
    >
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="min-w-0 flex-1">
          <p className="font-medium text-sm">{holding.fund.name.split(" ").slice(0, 3).join(" ")}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{holding.fundSymbol} · {formatShares(holding.shares)} shares</p>
        </div>
        <div className="text-right ml-3 shrink-0">
          <CurrencyDisplay amount={holding.currentValue} className="font-semibold font-financial" />
          <div className="flex items-center justify-end gap-1.5 mt-0.5">
            <PercentageChange value={holding.gainLossPercent} size="sm" showIcon={false} />
            <DrawdownBadge value={holding.drawdownPercent} />
          </div>
        </div>
      </motion.button>

      <AnimatePresence>
        {expanded && (
          <div className="px-4 pb-4">
            <ExpandedDetail holding={holding} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
interface HoldingsTableProps {
  holdings: HoldingWithDetails[];
}

export function HoldingsTable({ holdings }: HoldingsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("value");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sorted = [...holdings].sort((a, b) => {
    let av: number | string, bv: number | string;
    switch (sortKey) {
      case "fund": av = a.fundSymbol; bv = b.fundSymbol; break;
      case "gainLossPercent": av = a.gainLossPercent; bv = b.gainLossPercent; break;
      case "drawdownPercent": av = a.drawdownPercent; bv = b.drawdownPercent; break;
      case "allocation": av = a.allocation; bv = b.allocation; break;
      default: av = a.currentValue; bv = b.currentValue;
    }
    if (typeof av === "string") return sortDir === "asc" ? av.localeCompare(bv as string) : (bv as string).localeCompare(av);
    return sortDir === "asc" ? (av as number) - (bv as number) : (bv as number) - (av as number);
  });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const SortHead = ({ col, label, align = "right" }: { col: SortKey; label: string; align?: "left" | "right" }) => (
    <TableHead
      className={`cursor-pointer select-none hover:text-foreground transition-colors ${align === "right" ? "text-right" : ""}`}
      onClick={() => toggleSort(col)}
    >
      {label}
      <SortIcon col={col} active={sortKey === col} dir={sortDir} />
    </TableHead>
  );

  if (holdings.length === 0) {
    return (
      <Card className="animate-fade-in-up stagger-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[100px] text-muted-foreground text-sm">
            No holdings yet. Browse funds to start investing.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in-up stagger-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Holdings</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Mobile: stacked cards */}
        <div className="md:hidden space-y-2">
          {sorted.map((h) => (
            <HoldingCard key={h.id} holding={h} />
          ))}
        </div>

        {/* Desktop: sortable table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <SortHead col="fund" label="Fund" align="left" />
                <TableHead className="text-right">Shares</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <SortHead col="value" label="Value" />
                <SortHead col="gainLossPercent" label="Gain/Loss" />
                <SortHead col="drawdownPercent" label="Drawdown" />
                <SortHead col="allocation" label="Alloc." />
                <TableHead className="w-8" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((holding) => {
                const isExpanded = expandedId === holding.id;
                const hasDrawdown = Math.abs(holding.drawdownPercent) > 20;
                return (
                  <>
                    <TableRow
                      key={holding.id}
                      className={[
                        "cursor-pointer hover:bg-muted/50 transition-colors group",
                        hasDrawdown ? "shadow-[inset_0_0_0_1px_hsl(var(--loss)/0.15)]" : "",
                      ].join(" ")}
                      onClick={() => setExpandedId(isExpanded ? null : holding.id)}
                    >
                      <TableCell>
                        <Link href={`/funds/${holding.fundSymbol}`} className="block" onClick={(e) => e.stopPropagation()}>
                          <p className="font-medium">{holding.fundSymbol}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[180px]">{holding.fund.name}</p>
                        </Link>
                      </TableCell>
                      <TableCell className="text-right font-financial">{formatShares(holding.shares)}</TableCell>
                      <TableCell className="text-right">
                        <CurrencyDisplay amount={holding.fund.currentPrice} size="sm" className="font-financial" />
                        <PercentageChange value={holding.fund.dayChange} size="sm" showIcon={false} className="block" />
                      </TableCell>
                      <TableCell className="text-right font-financial">
                        <CurrencyDisplay amount={holding.currentValue} className="font-financial" />
                      </TableCell>
                      <TableCell className="text-right">
                        <CurrencyDisplay amount={holding.gainLoss} showSign colorCode size="sm" className="font-financial" />
                        <PercentageChange value={holding.gainLossPercent} size="sm" showIcon={false} className="block" />
                      </TableCell>
                      <TableCell className="text-right">
                        <DrawdownBadge value={holding.drawdownPercent} />
                      </TableCell>
                      <TableCell className="text-right font-financial">{holding.allocation.toFixed(1)}%</TableCell>
                      <TableCell className="text-right">
                        <ChevronRight
                          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                        />
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow key={`${holding.id}-expanded`}>
                        <TableCell colSpan={8} className="p-0">
                          <AnimatePresence>
                            <ExpandedDetail holding={holding} />
                          </AnimatePresence>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
