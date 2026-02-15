import { prisma } from "@/lib/prisma";
import { ProductTable } from "@/components/admin/ProductTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProductFormDialog } from "@/components/admin/ProductFormDialog";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your brownie catalog and inventory.
          </p>
        </div>
        <ProductFormDialog categories={categories}>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </ProductFormDialog>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <ProductTable products={products} categories={categories} />
      </div>
    </div>
  );
}
