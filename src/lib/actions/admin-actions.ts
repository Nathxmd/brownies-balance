"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { OrderStatus, PaymentStatus, UserRole } from "@prisma/client";

/**
 * DASHBOARD ANALYTICS
 */

export async function getDashboardStats() {
  const [
    totalRevenue,
    totalOrders,
    pendingOrders,
    lowStockCount,
    topProducts,
  ] = await Promise.all([
    // Total Revenue (Only completed/delivered orders that are paid)
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { 
        paymentStatus: PaymentStatus.PAID,
        status: { not: "CANCELLED" }
      },
    }),
    
    // Total Orders
    prisma.order.count(),
    
    // Pending Orders (Awaiting confirmation or payment)
    prisma.order.count({
      where: {
        OR: [
          { status: OrderStatus.PENDING },
          { paymentStatus: PaymentStatus.UNPAID }
        ]
      }
    }),
    
    // Low Stock Count
    prisma.product.count({
      where: {
        isAvailable: true,
        stock: { lte: prisma.product.fields.lowStockAlert }
      }
    }),

    // Top Products (by aggregated quantity sold)
    prisma.orderItem.groupBy({
      by: ['productId', 'productName'],
      _sum: { quantity: true, subtotal: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5
    })
  ]);

  return {
    revenue: totalRevenue._sum.totalAmount || 0,
    orders: totalOrders,
    pending: pendingOrders,
    lowStock: lowStockCount,
    topProducts: topProducts.map(item => ({
      id: item.productId,
      name: item.productName,
      quantity: item._sum.quantity || 0,
      totalSales: item._sum.subtotal || 0
    }))
  };
}

/**
 * ORDER MANAGEMENT
 */

export async function getOrders(filters?: { status?: OrderStatus }) {
  return await prisma.order.findMany({
    where: {
      ...(filters?.status && { status: filters.status })
    },
    include: {
      items: {
        include: { product: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function getOrderById(id: string) {
  return await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: true }
      }
    }
  });
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/orders");
    return { success: true, order };
  } catch (error) {
    console.error("Update Order Status Error:", error);
    return { success: false, error: "Failed to update order status" };
  }
}

export async function updatePaymentStatus(orderId: string, status: PaymentStatus) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: status }
    });

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/orders");
    return { success: true, order };
  } catch (error) {
    console.error("Update Payment Status Error:", error);
    return { success: false, error: "Failed to update payment status" };
  }
}

/**
 * USER MANAGEMENT
 */

export async function getAdminUsers() {
  return await prisma.user.findMany({
    where: {
      role: { in: [UserRole.ADMIN, UserRole.STAFF] }
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function updateUserRole(userId: string, role: UserRole) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role }
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Update User Role Error:", error);
    return { success: false, error: "Failed to update user role" };
  }
}
