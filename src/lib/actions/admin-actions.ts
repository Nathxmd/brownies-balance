"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { OrderStatus, PaymentStatus, UserRole } from "@prisma/client";

/**
 * DASHBOARD ANALYTICS
 */

export async function getDashboardStats() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalRevenue,
    totalOrders,
    pendingOrders,
    lowStockCount,
    topProducts,
    revenueDataRaw,
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
    }),

    // Revenue for the last 30 days
    prisma.order.findMany({
      where: {
        paymentStatus: PaymentStatus.PAID,
        status: { not: "CANCELLED" },
        createdAt: { gte: thirtyDaysAgo }
      },
      select: {
        createdAt: true,
        totalAmount: true
      },
      orderBy: { createdAt: 'asc' }
    })
  ]);

  // Aggregate revenue by date
  const revenueByDate = new Map<string, number>();
  
  // Initialize last 30 days with 0
  for (let i = 0; i <= 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    revenueByDate.set(d.toISOString().split('T')[0], 0);
  }

  // Fill in active data
  revenueDataRaw.forEach(order => {
    const dateKey = order.createdAt.toISOString().split('T')[0];
    const current = revenueByDate.get(dateKey) || 0;
    revenueByDate.set(dateKey, current + order.totalAmount);
  });

  // Convert to sorted array
  const formattedRevenueData = Array.from(revenueByDate.entries())
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => a.date.localeCompare(b.date));

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
    })),
    revenueData: formattedRevenueData
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
    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true, order };
  } catch (error) {
    console.error("Update Payment Status Error:", error);
    return { success: false, error: "Failed to update payment status" };
  }
}

export async function updatePaymentProof(orderId: string, url: string | null) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { paymentProof: url }
    });

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true, order };
  } catch (error) {
    console.error("Update Payment Proof Error:", error);
    return { success: false, error: "Failed to update payment proof" };
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

/**
 * EXPENSE MANAGEMENT
 */

export async function getExpenses() {
  return await prisma.expense.findMany({
    orderBy: { paidAt: "desc" }
  });
}

import { ExpenseFormValues } from "@/lib/schemas/expense";

export async function createExpense(values: ExpenseFormValues) {
  try {
    const expense = await prisma.expense.create({
      data: {
        description: values.description,
        amount: values.amount,
        category: values.category,
        paymentMethod: values.paymentMethod,
        vendor: values.vendor,
        notes: values.notes,
        paidAt: values.paidAt,
      }
    });

    revalidatePath("/admin/cashflow");
    return { success: true, expense };
  } catch (error) {
    console.error("Create Expense Error:", error);
    return { success: false, error: "Failed to create expense" };
  }
}

export async function deleteExpense(id: string) {
  try {
    await prisma.expense.delete({
      where: { id }
    });

    revalidatePath("/admin/cashflow");
    return { success: true };
  } catch (error) {
    console.error("Delete Expense Error:", error);
    return { success: false, error: "Failed to delete expense" };
  }
}
