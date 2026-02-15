"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  FileText,
  CheckCircle,
  Truck,
  XCircle,
  MessageSquare
} from "lucide-react";
import { Order, OrderItem, Product, OrderStatus, PaymentStatus } from "@prisma/client";
import { updateOrderStatus, updatePaymentStatus } from "@/lib/actions/admin-actions";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

type OrderWithItems = Order & {
  items: (OrderItem & { product: Product })[];
};

interface OrderDetailProps {
  order: OrderWithItems;
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

export function OrderDetail({ order }: OrderDetailProps) {
  const { toast } = useToast();

  const handleStatusUpdate = async (status: OrderStatus) => {
    const result = await updateOrderStatus(order.id, status);
    if (result.success) {
      toast({ title: "Order status updated", description: `Order is now ${status}` });
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
  };

  const handlePaymentUpdate = async (status: PaymentStatus) => {
    const result = await updatePaymentStatus(order.id, status);
    if (result.success) {
      toast({ title: "Payment status updated", description: `Payment is now ${status}` });
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Left Column: Customer & Order Items */}
      <div className="md:col-span-2 space-y-6">

        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 border-b pb-4 last:border-0 last:pb-0">
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                  <Image
                    src={item.product.thumbnail}
                    alt={item.productName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-semibold text-zinc-900">{item.productName}</h4>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-zinc-900">
                      Rp {item.subtotal.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Price per unit: Rp {item.price.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            ))}

            <div className="pt-4 space-y-2 border-t text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>Rp {order.subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>Rp 0</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total Amount</span>
                <span className="text-orange-600">
                  Rp {order.totalAmount.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

                <Card>
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <MapPin size={18} className="text-muted-foreground shrink-0" />
                  <div>
                    <p className="font-semibold">{order.customerName}</p>
                    <p className="text-muted-foreground">{order.deliveryAddress}</p>
                    <p className="text-muted-foreground">{order.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-muted-foreground" />
                  <span>{order.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-muted-foreground" />
                  <span className="truncate">{order.email}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Delivery Date</span>
                    <span>{new Date(order.deliveryDate).toLocaleDateString('id-ID', { dateStyle: 'long' })}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Delivery Time</span>
                    <span>{order.deliveryTime}</span>
                  </div>
                </div>
                <div className="pt-2">
                  <Button 
                    asChild 
                    className="w-full bg-green-600 hover:bg-green-700 gap-2 text-xs h-9"
                  >
                    <a 
                      href={`https://wa.me/${order.phone.replace(/^0/, '62')}?text=${encodeURIComponent(
                        `Halo ${order.customerName},\n\nOrderan Anda dengan nomor *${order.orderNumber}* berhasil dikonfirmasi.\n\nUntuk pembayaran silahkan bisa melalui QRIS/Transfer Bank dll. Lalu kirimkan bukti pembayaran Anda ke chat ini untuk diproses lebih lanjut.\n\nTerima kasih!`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageSquare size={16} /> Hubungi via WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {order.notes && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText size={18} /> Customer Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-600 italic">&quot;{order.notes}&quot;</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Right Column: Information & Actions */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Order Status</p>
              <Badge className={`${statusColors[order.status]} border-none py-1 px-3`}>
                {order.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Payment Status</p>
              <Badge variant={order.paymentStatus === "PAID" ? "default" : "outline"} className="py-1 px-3 capitalize">
                {order.paymentStatus.toLowerCase()}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start gap-2 bg-blue-600 hover:bg-blue-700"
              onClick={() => handleStatusUpdate("CONFIRMED")}
              disabled={order.status === "CONFIRMED"}
            >
              <CheckCircle size={18} /> Confirm Order
            </Button>
            <Button 
              className="w-full justify-start gap-2 bg-purple-600 hover:bg-purple-700"
              onClick={() => handleStatusUpdate("PROCESSING")}
              disabled={order.status === "PROCESSING"}
            >
              <Truck size={18} /> Start Processing
            </Button>
            <Button 
              className="w-full justify-start gap-2 bg-indigo-600 hover:bg-indigo-700"
              onClick={() => handleStatusUpdate("READY")}
              disabled={order.status === "READY"}
            >
              <Truck size={18} /> Ready to Deliver
            </Button>
            <Button 
              className="w-full justify-start gap-2 bg-emerald-600 hover:bg-emerald-700"
              onClick={() => handleStatusUpdate("COMPLETED")}
              disabled={order.status === "COMPLETED"}
            >
              <CheckCircle size={18} /> Complete Order
            </Button>
            <div className="pt-3 border-t">
              <Button 
                variant="outline"
                className="w-full justify-start gap-2 border-green-600 text-green-600 hover:bg-green-50"
                onClick={() => handlePaymentUpdate("PAID")}
                disabled={order.paymentStatus === "PAID"}
              >
                <CreditCard size={18} /> Mark as Paid
              </Button>
            </div>
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => handleStatusUpdate("CANCELLED")}
              disabled={order.status === "CANCELLED"}
            >
              <XCircle size={18} /> Cancel Order
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
