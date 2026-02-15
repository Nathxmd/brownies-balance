"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ProductSchema, ProductFormValues } from "@/lib/schemas/product";


function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export async function createProduct(values: ProductFormValues) {
  try {
    const validatedFields = ProductSchema.parse(values);
    const { isBestSeller, ...data } = validatedFields;
    
    // ✅ Build tags array with default brownies tags
    const tags = ["gluten-free", "low-sugar", "oat-based"];
    if (isBestSeller) {
      tags.push("bestseller");
    }
    
    const product = await prisma.product.create({
      data: {
        ...data,
        slug: `${slugify(values.name)}-${Math.random().toString(36).substring(2, 7)}`,
        tags,
        lowStockAlert: 5, // ✅ Default low stock alert
        isPreOrder: true, // ✅ Default pre-order enabled
        preOrderDays: 2, // ✅ H-2 delivery
      },
    });
    
    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true, data: product };
  } catch (error) {
    console.error("Create Product Error:", error);
    return { success: false, error: "Failed to create product" };
  }
}

export async function updateProduct(id: string, values: ProductFormValues) {
  try {
    const validatedFields = ProductSchema.parse(values);
    const { isBestSeller, ...data } = validatedFields;
    
    // ✅ Update tags while keeping default tags
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      select: { tags: true },
    });
    
    const defaultTags = ["gluten-free", "low-sugar", "oat-based"];
    const otherTags = existingProduct?.tags.filter(
      tag => !["bestseller", "gluten-free", "low-sugar", "oat-based"].includes(tag)
    ) || [];
    
    const tags = [...defaultTags, ...otherTags];
    if (isBestSeller && !tags.includes("bestseller")) {
      tags.push("bestseller");
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        tags,
      },
    });
    
    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath(`/products/${product.slug}`);
    return { success: true, data: product };
  } catch (error) {
    console.error("Update Product Error:", error);
    return { success: false, error: "Failed to update product" };
  }
}

export async function deleteProduct(id: string) {
  try {
    // ✅ Check if product has orders first
    const hasOrders = await prisma.orderItem.count({
      where: { productId: id },
    });

    if (hasOrders > 0) {
      return { 
        success: false, 
        error: "Cannot delete product with existing orders. Set as unavailable instead." 
      };
    }

    await prisma.product.delete({
      where: { id },
    });
    
    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    console.error("Delete Product Error:", error);
    return { success: false, error: "Failed to delete product" };
  }
}

export async function getCategories() {
  return await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
}

// ✅ Additional helper functions

export async function getProducts(filters?: {
  categoryId?: string;
  isAvailable?: boolean;
  search?: string;
}) {
  return await prisma.product.findMany({
    where: {
      ...(filters?.categoryId && { categoryId: filters.categoryId }),
      ...(filters?.isAvailable !== undefined && { isAvailable: filters.isAvailable }),
      ...(filters?.search && {
        OR: [
          { name: { contains: filters.search, mode: "insensitive" } },
          { description: { contains: filters.search, mode: "insensitive" } },
        ],
      }),
    },
    include: {
      category: true,
    },
    orderBy: [
      { isAvailable: "desc" }, // Available products first
      { createdAt: "desc" },
    ],
  });
}

export async function getProductById(id: string) {
  return await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      reviews: {
        where: { isApproved: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });
}

export async function toggleProductAvailability(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      select: { isAvailable: true },
    });

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    await prisma.product.update({
      where: { id },
      data: { isAvailable: !product.isAvailable },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    console.error("Toggle Availability Error:", error);
    return { success: false, error: "Failed to toggle availability" };
  }
}

export async function updateStock(id: string, quantity: number, operation: "add" | "subtract" | "set") {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      select: { stock: true },
    });

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    let newStock: number;
    
    switch (operation) {
      case "add":
        newStock = product.stock + quantity;
        break;
      case "subtract":
        newStock = Math.max(0, product.stock - quantity);
        break;
      case "set":
        newStock = Math.max(0, quantity);
        break;
    }

    await prisma.product.update({
      where: { id },
      data: { stock: newStock },
    });

    revalidatePath("/admin/products");
    return { success: true, stock: newStock };
  } catch (error) {
    console.error("Update Stock Error:", error);
    return { success: false, error: "Failed to update stock" };
  }
}

// ✅ Get low stock products for dashboard alerts
export async function getLowStockProducts() {
  return await prisma.product.findMany({
    where: {
      isAvailable: true,
      stock: {
        lte: prisma.product.fields.lowStockAlert, // Stock <= lowStockAlert
      },
    },
    include: {
      category: true,
    },
    orderBy: { stock: "asc" },
  });
}

// ✅ Get best sellers for landing page
export async function getBestSellers(limit = 4) {
  return await prisma.product.findMany({
    where: {
      isAvailable: true,
      tags: {
        has: "bestseller",
      },
    },
    include: {
      category: true,
      reviews: {
        where: { isApproved: true },
      },
    },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}