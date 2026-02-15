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
  productId?: string;
}) {
  try {
    // 1. Generate Order Number: BRW-YYYYMMDD-XXXX
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
    const count = await prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(today.setHours(0, 0, 0, 0)),
        },
      },
    });
    const orderNumber = `BRW-${dateStr}-${(count + 1).toString().padStart(3, "0")}`;

    // 2. Handle Product and Pricing
    let subtotal = 0;
    let productName = "General Pre-Order";
    let productPrice = 0;

    if (values.productId) {
      const product = await prisma.product.findUnique({
        where: { id: values.productId },
      });
      if (product) {
        subtotal = product.price;
        productName = product.name;
        productPrice = product.price;
      }
    }

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
        items: values.productId ? {
          create: {
            productId: values.productId,
            productName: productName,
            quantity: 1,
            price: productPrice,
            subtotal: productPrice,
          }
        } : undefined,
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
