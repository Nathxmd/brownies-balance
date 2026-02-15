"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye, CheckCircle, XCircle, Truck, CreditCard } from "lucide-react";
import { Order, OrderItem, Product, OrderStatus, PaymentStatus } from "@prisma/client";
import { updateOrderStatus, updatePaymentStatus } from "@/lib/actions/admin-actions";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

type OrderWithItems = Order & {
  items: (OrderItem & { product: Product })[];
};

interface OrderTableProps {
  orders: OrderWithItems[];
}

const statusColors: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PAID: "bg-green-100 text-green-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  READY: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-emerald-100 text-emerald-800",
  COMPLETED: "bg-zinc-100 text-zinc-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export function OrderTable({ orders }: OrderTableProps) {
  const { toast } = useToast();

  const handleStatusUpdate = async (id: string, status: OrderStatus) => {
    const result = await updateOrderStatus(id, status);
    if (result.success) {
      toast({ title: "Order status updated", description: `Order is now ${status}` });
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
  };

  const handlePaymentUpdate = async (id: string, status: PaymentStatus) => {
    const result = await updatePaymentStatus(id, status);
    if (result.success) {
      toast({ title: "Payment status updated", description: `Order is now ${status}` });
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Payment</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="h-24 text-center">
              No orders found.
            </TableCell>
          </TableRow>
        ) : (
          orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium text-xs">
                {order.orderNumber}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{order.customerName}</span>
                  <span className="text-xs text-muted-foreground">{order.phone}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={`${statusColors[order.status]} border-none`}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={order.paymentStatus === "PAID" ? "default" : "outline"} className="text-[10px]">
                  {order.paymentStatus}
                </Badge>
              </TableCell>
              <TableCell>
                Rp {order.totalAmount.toLocaleString('id-ID')}
              </TableCell>
              <TableCell className="text-xs">
                {new Date(order.createdAt).toLocaleDateString('id-ID')}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <Link href={`/admin/orders/${order.id}`}>
                      <DropdownMenuItem className="cursor-pointer">
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-xs text-muted-foreground">Update Status</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "CONFIRMED")}>
                      <CheckCircle className="mr-2 h-4 w-4 text-blue-500" /> Confirm Order
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "PROCESSING")}>
                      <Truck className="mr-2 h-4 w-4 text-purple-500" /> Start Processing
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "READY")}>
                      <Truck className="mr-2 h-4 w-4 text-indigo-500" /> Ready to Deliver
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "COMPLETED")}>
                      <CheckCircle className="mr-2 h-4 w-4 text-emerald-500" /> Complete Order
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handlePaymentUpdate(order.id, "PAID")}>
                      <CreditCard className="mr-2 h-4 w-4 text-green-500" /> Mark as Paid
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "CANCELLED")} className="text-red-600">
                      <XCircle className="mr-2 h-4 w-4" /> Cancel Order
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
