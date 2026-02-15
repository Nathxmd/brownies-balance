"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { DeliveryTime } from "@prisma/client";

export async function submitOrder(values: {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  deliveryDate: string;
  deliveryTime: DeliveryTime;
  notes?: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}) {
  try {
    if (!values.items || values.items.length === 0) {
      return { success: false, error: "Keranjang belanja kosong." };
    }

    // 1. Generate Order Number: BRW-YYYYMMDD-XXXX
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
    
    // Get start of today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const count = await prisma.order.count({
      where: {
        createdAt: {
          gte: startOfToday,
        },
      },
    });
    const orderNumber = `BRW-${dateStr}-${(count + 1).toString().padStart(3, "0")}`;

    // 2. Calculate Totals
    const subtotal = values.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // 3. Create Order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: values.customerName,
        email: values.email,
        phone: values.phone,
        deliveryAddress: values.address,
        city: values.city,
        deliveryDate: new Date(values.deliveryDate),
        deliveryTime: values.deliveryTime,
        subtotal,
        totalAmount: subtotal, // For now, assume no delivery fee or discount here
        notes: values.notes,
        status: "PENDING",
        items: {
          create: values.items.map(item => ({
            productId: item.id,
            productName: item.name,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity,
          }))
        },
      },
    });

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/orders");

    return { success: true, orderId: order.id, orderNumber: order.orderNumber };
  } catch (error) {
    console.error("Submit Order Error:", error);
    return { success: false, error: "Gagal membuat pesanan. Silakan coba lagi." };
  }
}
