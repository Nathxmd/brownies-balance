"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProductForm } from "./ProductForm";
import { useState } from "react";
import { Product, Category } from "@prisma/client";

interface ProductFormDialogProps {
  children: React.ReactNode;
  product?: Product;
  categories: Category[];
}

export function ProductFormDialog({
  children,
  product,
  categories,
}: ProductFormDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
          <DialogDescription>
            {product
              ? "Make changes to your product here. Click save when you're done."
              : "Fill in the details below to create a new brownie product."}
          </DialogDescription>
        </DialogHeader>
        <ProductForm 
          product={product} 
          categories={categories} 
          onSuccess={() => setOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  );
}
