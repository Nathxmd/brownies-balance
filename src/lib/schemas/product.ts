import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  categoryId: z.string().min(1, "Category is required"),
  thumbnail: z.string().url("Valid thumbnail URL is required"),
  isAvailable: z.boolean(),
  isBestSeller: z.boolean(),
});

export type ProductFormValues = z.infer<typeof ProductSchema>;
