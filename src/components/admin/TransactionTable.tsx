"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ArrowDownLeft, ArrowUpRight, Tag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteExpense } from "@/lib/actions/admin-actions";
import { useToast } from "@/hooks/use-toast";

export type Transaction = {
  id: string;
  date: Date;
  description: string;
  category: string;
  amount: number;
  type: "INCOME" | "EXPENSE"; // INCOME for Orders, EXPENSE for Expenses
  method: string;
};

interface TransactionTableProps {
  transactions: Transaction[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  const { toast } = useToast();

  const handleDelete = async (id: string, type: "INCOME" | "EXPENSE") => {
    if (type === "INCOME") {
      toast({ title: "Fitur hapus order ada di menu Orders", variant: "destructive" });
      return;
    }

    if (confirm("Hapus catatan pengeluaran ini?")) {
      const result = await deleteExpense(id);
      if (result.success) {
        toast({ title: "Pengeluaran dihapus" });
      } else {
        toast({ title: "Gagal menghapus", variant: "destructive" });
      }
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border rounded-xl bg-zinc-50/50">
        <p className="text-zinc-500 font-medium">Belum ada riwayat transaksi.</p>
        <p className="text-xs text-zinc-400">Transaksi order atau pengeluaran akan muncul di sini.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white overflow-hidden">
      <Table>
        <TableHeader className="bg-zinc-50/50">
          <TableRow>
            <TableHead className="w-[120px]">Tanggal</TableHead>
            <TableHead>Keterangan</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Metode</TableHead>
            <TableHead className="text-right">Jumlah</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id} className="group">
              <TableCell className="text-xs text-zinc-500 font-medium">
                {format(new Date(tx.date), "dd MMM yyyy")}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-lg shrink-0",
                    tx.type === "INCOME" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  )}>
                    {tx.type === "INCOME" ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                  </div>
                  <span className="font-bold text-zinc-900 line-clamp-1">{tx.description}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-widest bg-zinc-100 px-2 py-1 rounded-md w-fit">
                   <Tag size={10} /> {tx.category.replace("_", " ")}
                </div>
              </TableCell>
              <TableCell className="text-xs font-bold text-zinc-400">
                {tx.method.replace("_", " ")}
              </TableCell>
              <TableCell className={cn(
                "text-right font-black",
                tx.type === "INCOME" ? "text-green-600" : "text-red-500"
              )}>
                {tx.type === "INCOME" ? "+" : "-"} Rp {tx.amount.toLocaleString('id-ID')}
              </TableCell>
              <TableCell>
                {tx.type === "EXPENSE" && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-zinc-300 hover:text-red-500 transition-colors"
                    onClick={() => handleDelete(tx.id, tx.type)}
                  >
                    <Trash2 size={14} />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
