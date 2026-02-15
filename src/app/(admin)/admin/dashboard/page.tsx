import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { getDashboardStats } from "@/lib/actions/admin-actions";

import { RevenueChart } from "@/components/admin/RevenueChart";

export default async function DashboardPage() {
  const statsData = await getDashboardStats();

  const cards = [
    {
      title: "Total Revenue",
      value: `Rp ${statsData.revenue.toLocaleString('id-ID')}`,
      description: "Paid & Delivered",
      icon: DollarSign,
      trend: "none",
    },
    {
      title: "Total Orders",
      value: statsData.orders.toString(),
      description: "Lifetime orders",
      icon: ShoppingCart,
      trend: "none",
    },
    {
      title: "Pending Orders",
      value: statsData.pending.toString(),
      description: "Requires action",
      icon: ShoppingCart,
      trend: "none",
    },
    {
      title: "Low Stock",
      value: statsData.lowStock.toString(),
      description: "Products under threshold",
      icon: Package,
      trend: statsData.lowStock > 0 ? "down" : "none",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome back, admin. Here&apos;s what&apos;s happening with Brownies Balance today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <Icon size={16} className="text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {card.trend === "up" && <ArrowUpRight size={12} className="text-green-500" />}
                  {card.trend === "down" && <ArrowDownRight size={12} className="text-red-500" />}
                  {card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-xl border bg-card p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-semibold mb-6">Revenue Trend (30 Days)</h3>
          <div className="flex-1 min-h-[300px]">
            <RevenueChart data={statsData.revenueData} />
          </div>
        </div>
        <div className="col-span-3 rounded-xl border bg-card p-6 shadow-sm min-h-[400px]">
          <h3 className="text-lg font-semibold mb-4">Top Products</h3>
          <div className="space-y-4">
             {statsData.topProducts.length > 0 ? (
               statsData.topProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                    {product.name.charAt(0)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.quantity} units sold</p>
                  </div>
                  <div className="font-medium text-sm">
                    Rp {product.totalSales.toLocaleString('id-ID')}
                  </div>
                </div>
               ))
             ) : (
               <div className="flex items-center justify-center h-full text-muted-foreground italic py-20">
                 No sales data yet
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
