import { getDashboardStats, getOrders } from "@/lib/actions/admin-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ArrowUpRight, ShoppingBag } from "lucide-react";

export default async function AdminCashflowPage() {
  const stats = await getDashboardStats();
  const orders = await getOrders();

  const totalPossible = orders.reduce((acc, order) => acc + order.totalAmount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financial Overview</h1>
        <p className="text-muted-foreground">
          Monitor your sales, revenue, and pending payments.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Realized Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              Rp {stats.revenue.toLocaleString('id-ID')}
            </div>
            <p className="text-xs text-muted-foreground">Successfully paid & confirmed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potential Revenue</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              Rp {totalPossible.toLocaleString('id-ID')}
            </div>
            <p className="text-xs text-muted-foreground">Including pending payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Collection Rate</CardTitle>
            <ShoppingBag className="h-4 w-4 text-zinc-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalPossible > 0 ? Math.round((stats.revenue / totalPossible) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Collection efficiency</p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
        <p className="text-sm text-muted-foreground italic">
          Detailed ledger of every transaction will appear here as you log expenses.
        </p>
      </div>
    </div>
  );
}
