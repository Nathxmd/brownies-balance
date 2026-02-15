"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const navItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Cashflow",
    href: "/admin/cashflow",
    icon: TrendingUp,
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    title: "User Management",
    href: "/admin/users",
    icon: Users,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside 
      className={cn(
        "relative flex flex-col h-screen border-r bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 h-16 border-b">
        {!collapsed && (
          <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-amber-900 bg-clip-text text-transparent">
            Brownies Balance
          </span>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <nav className="flex-1 flex flex-col gap-2 p-2 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors overflow-hidden",
                isActive 
                  ? "bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-100" 
                  : "hover:bg-muted text-muted-foreground"
              )}
            >
              <Icon size={20} className="shrink-0" />
              {!collapsed && (
                <span className="font-medium whitespace-nowrap">
                  {item.title}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 px-3 overflow-hidden text-red-500 hover:text-red-600 hover:bg-red-50",
            collapsed && "justify-center px-0"
          )}
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut size={20} className="shrink-0" />
          {!collapsed && <span className="font-medium">Logout</span>}
        </Button>
      </div>
    </aside>
  );
}
