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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { getCurrentTaxYear } from "@/lib/constants";
import { formatCurrency } from "@/lib/formatters";
import { useState, useEffect } from "react";

const STORAGE_KEY = "isa-sidebar-collapsed";

const navItems = [
  { title: "Portfolio", href: "/", icon: LayoutDashboard },
  { title: "Performance", href: "/performance", icon: TrendingUp },
  { title: "ISA Allowance", href: "/allowance", icon: PiggyBank },
  { title: "Transactions", href: "/transactions", icon: Receipt },
  { title: "Funds", href: "/funds", icon: Search },
];

interface SidebarProps {
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function Sidebar({ onCollapsedChange }: SidebarProps) {
  const pathname = usePathname();
  const taxYear = getCurrentTaxYear();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) setCollapsed(stored === "true");
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem(STORAGE_KEY, String(next));
    onCollapsedChange?.(next);
  };

  if (!mounted) return null;

  const sidebarWidth = collapsed ? 64 : 288;

  return (
    <motion.aside
      className="hidden md:flex fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border/50 flex-col overflow-hidden"
      animate={{ width: sidebarWidth }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Logo */}
      <div className="flex h-20 items-center px-4 shrink-0 relative">
        <Link href="/" className="flex items-center gap-3 group min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl gradient-primary shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
            <Wallet className="h-4 w-4 text-white" />
          </div>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <p className="text-base font-bold text-foreground leading-tight">ISA Dashboard</p>
                <p className="text-xs text-muted-foreground">Stocks & Shares</p>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {!collapsed && (
          <p className="px-3 mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Menu
          </p>
        )}
        {navItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <div key={item.href} className="relative group/item">
              <Link
                href={item.href}
                className={cn(
                  "flex items-center rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 btn-press animate-fade-in-up",
                  collapsed ? "justify-center" : "gap-3",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary-foreground")} />
                <AnimatePresence initial={false}>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      {item.title}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
              {/* Collapsed tooltip */}
              {collapsed && (
                <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 opacity-0 group-hover/item:opacity-100 transition-opacity duration-150">
                  <div className="bg-popover border border-border text-foreground text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                    {item.title}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 shrink-0 space-y-2">
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10">
                <p className="text-sm font-medium text-foreground">Tax Year {taxYear.id}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Allowance: {formatCurrency(taxYear.allowance)}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapse toggle */}
        <button
          onClick={toggle}
          className={cn(
            "flex items-center rounded-xl px-3 py-2.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200 btn-press w-full",
            collapsed ? "justify-center" : "gap-2"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
