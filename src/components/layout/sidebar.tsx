"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  PiggyBank,
  Receipt,
  Search,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getCurrentTaxYear } from "@/lib/constants";
import { formatCurrency } from "@/lib/formatters";

const navItems = [
  { title: "Portfolio", href: "/", icon: LayoutDashboard },
  { title: "Performance", href: "/performance", icon: TrendingUp },
  { title: "ISA Allowance", href: "/allowance", icon: PiggyBank },
  { title: "Transactions", href: "/transactions", icon: Receipt },
  { title: "Funds", href: "/funds", icon: Search },
];

export function Sidebar() {
  const pathname = usePathname();
  const taxYear = getCurrentTaxYear();

  return (
    // Hidden on mobile — BottomNav handles mobile navigation
    <aside className="hidden md:flex fixed left-0 top-0 z-40 h-screen w-72 bg-sidebar border-r border-sidebar-border/50 flex-col">
      {/* Logo */}
      <div className="flex h-20 items-center px-6 shrink-0">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-foreground">ISA Dashboard</span>
            <p className="text-xs text-muted-foreground">Stocks & Shares</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <p className="px-3 mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Menu
        </p>
        {navItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 btn-press animate-fade-in-up",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <item.icon
                className={cn("h-5 w-5 shrink-0", isActive && "text-primary-foreground")}
              />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 shrink-0">
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10">
          <p className="text-sm font-medium text-foreground">Tax Year {taxYear.id}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Allowance: {formatCurrency(taxYear.allowance)}
          </p>
        </div>
      </div>
    </aside>
  );
}
