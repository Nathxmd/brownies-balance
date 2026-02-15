import { getDashboardStats, getOrders, getExpenses } from "@/lib/actions/admin-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ArrowUpRight, ShoppingBag, TrendingDown } from "lucide-react";
import { TransactionTable, Transaction } from "@/components/admin/TransactionTable";
import { ExpenseDialog } from "@/components/admin/ExpenseDialog";
import { cn } from "@/lib/utils";

export default async function AdminCashflowPage() {
  const [stats, orders, expenses] = await Promise.all([
    getDashboardStats(),
    getOrders(),
    getExpenses(),
  ]);

  const totalPossible = orders.reduce((acc, order) => acc + order.totalAmount, 0);
  const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);
  const netProfit = stats.revenue - totalExpenses;

  // Combine Orders (Income) and Expenses into a single transaction list
  const transactions: Transaction[] = [
    ...orders
      .filter(o => o.paymentStatus === "PAID")
      .map(o => ({
        id: o.id,
        date: o.createdAt,
        description: `Order #${o.orderNumber} - ${o.customerName}`,
        category: "SALES",
        amount: o.totalAmount,
        type: "INCOME" as const,
        method: o.paymentMethod,
      })),
    ...expenses.map(e => ({
      id: e.id,
      date: e.paidAt,
      description: e.description,
      category: e.category,
      amount: e.amount,
      type: "EXPENSE" as const,
      method: e.paymentMethod,
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 uppercase">Financial Overview</h1>
          <p className="text-zinc-500 font-medium">
            Monitor your sales, revenue, and business expenses.
          </p>
        </div>
        <ExpenseDialog />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-xl shadow-zinc-100 bg-white group hover:translate-y-[-4px] transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Realized Revenue</CardTitle>
            <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-600 group-hover:text-white transition-colors">
              <DollarSign className="h-4 w-4 text-green-600 group-hover:text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-green-600 tracking-tighter">
              Rp {stats.revenue.toLocaleString('id-ID')}
            </div>
            <p className="text-[10px] text-zinc-400 font-bold uppercase mt-1">Successfully paid</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl shadow-zinc-100 bg-white group hover:translate-y-[-4px] transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Expenses</CardTitle>
            <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-500 group-hover:text-white transition-colors">
              <TrendingDown className="h-4 w-4 text-red-500 group-hover:text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-red-500 tracking-tighter">
              Rp {totalExpenses.toLocaleString('id-ID')}
            </div>
            <p className="text-[10px] text-zinc-400 font-bold uppercase mt-1">Business costs</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl shadow-zinc-100 bg-zinc-900 group hover:translate-y-[-4px] transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Net Profit</CardTitle>
            <div className="p-2 bg-zinc-800 rounded-lg group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <ArrowUpRight className="h-4 w-4 text-zinc-400 group-hover:text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-2xl font-black tracking-tighter",
              netProfit >= 0 ? "text-white" : "text-red-400"
            )}>
              Rp {netProfit.toLocaleString('id-ID')}
            </div>
            <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">Bottom line</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl shadow-zinc-100 bg-white group hover:translate-y-[-4px] transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Potential</CardTitle>
            <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <ShoppingBag className="h-4 w-4 text-orange-600 group-hover:text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-orange-600 tracking-tighter">
              Rp {totalPossible.toLocaleString('id-ID')}
            </div>
            <p className="text-[10px] text-zinc-400 font-bold uppercase mt-1">Total orders</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-black tracking-tight text-zinc-900 uppercase">Transaction History</h3>
          <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
            {transactions.length} Total Records
          </div>
        </div>
        <TransactionTable transactions={transactions} />
      </div>
    </div>
  );
}
