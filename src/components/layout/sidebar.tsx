"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  PiggyBank,
  Receipt,
  Search,
  Menu,
  X,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const navItems = [
  {
    title: "Portfolio",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Performance",
    href: "/performance",
    icon: TrendingUp,
  },
  {
    title: "ISA Allowance",
    href: "/allowance",
    icon: PiggyBank,
  },
  {
    title: "Transactions",
    href: "/transactions",
    icon: Receipt,
  },
  {
    title: "Funds",
    href: "/funds",
    icon: Search,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3 left-3 z-50 md:hidden h-10 w-10 bg-background/80 backdrop-blur-sm shadow-sm rounded-xl border border-border/50 btn-press touch-target"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
      >
        {mobileOpen ? (
          <X className="h-5 w-5 text-foreground" />
        ) : (
          <Menu className="h-5 w-5 text-foreground" />
        )}
      </Button>

      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-72 bg-sidebar border-r border-sidebar-border/50 transition-transform duration-300 ease-out md:translate-x-0 flex flex-col",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 md:h-20 items-center px-6 shrink-0">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-foreground">
                ISA Dashboard
              </span>
              <p className="text-xs text-muted-foreground">Stocks & Shares</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 md:py-6 space-y-1 overflow-y-auto">
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
                  "flex items-center gap-3 rounded-xl px-4 py-3.5 md:py-3 text-sm font-medium transition-all duration-200 btn-press touch-target animate-fade-in-up",
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
            <p className="text-sm font-medium text-foreground">Tax Year 2024/25</p>
            <p className="text-xs text-muted-foreground mt-1">
              Allowance: £20,000
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
