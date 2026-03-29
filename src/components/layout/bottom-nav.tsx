"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, TrendingUp, PiggyBank, Receipt, Search } from "lucide-react";
import { motion, LayoutGroup } from "framer-motion";
import { cn } from "@/lib/utils";

const tabs = [
  { title: "Portfolio", href: "/", icon: LayoutDashboard },
  { title: "Performance", href: "/performance", icon: TrendingUp },
  { title: "Allowance", href: "/allowance", icon: PiggyBank },
  { title: "Transactions", href: "/transactions", icon: Receipt },
  { title: "Funds", href: "/funds", icon: Search },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="glass border-t border-border/40 bg-background/85 backdrop-blur-xl">
        <LayoutGroup id="bottom-nav">
          <div className="flex items-center justify-around px-2 h-16">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className="relative flex flex-col items-center justify-center gap-0.5 flex-1 py-2"
                >
                  <motion.div
                    whileTap={{ scale: 0.92 }}
                    className="relative flex flex-col items-center gap-0.5"
                  >
                    {/* Active dot indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="tab-indicator"
                        className="absolute -top-2.5 left-1/2 -translate-x-1/2 h-1 w-5 rounded-full bg-primary"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                    <tab.icon
                      className={cn(
                        "h-5 w-5 transition-colors duration-150",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                    <span
                      className={cn(
                        "text-[10px] font-medium transition-colors duration-150",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {tab.title}
                    </span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </LayoutGroup>
      </div>
    </nav>
  );
}
