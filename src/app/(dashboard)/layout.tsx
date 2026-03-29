import { SidebarShell } from "@/components/layout/sidebar-shell";
import { BottomNav } from "@/components/layout/bottom-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <SidebarShell>{children}</SidebarShell>
      <BottomNav />
    </div>
  );
}
