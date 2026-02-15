"use client";

import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createProduct,
  updateProduct,
} from "@/lib/actions/product-actions";
import { ProductSchema, ProductFormValues } from "@/lib/schemas/product";
import { Category, Product } from "@prisma/client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { UploadButton } from "@/lib/uploadthing";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { X, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  onSuccess?: () => void;
}

export function ProductForm({ product, categories, onSuccess }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductSchema) as Resolver<ProductFormValues>,
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: Number(product?.price) || 0,
      stock: Number(product?.stock) || 0,
      categoryId: product?.categoryId || "",
      thumbnail: product?.thumbnail || "",
      isAvailable: product?.isAvailable ?? true,
      isBestSeller: product?.tags?.includes("bestseller") || false,
    },
    mode: "onBlur",
  });

  const onSubmit = async (values: ProductFormValues) => {
    setIsLoading(true);
    const result = product
      ? await updateProduct(product.id, values)
      : await createProduct(values);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: "Success",
        description: product ? "Product updated successfully" : "Product created successfully",
        variant: "default", // ✅ Changed from "success" 
      });
      onSuccess?.();
    } else {
      toast({
        title: "Error",
        description: result.error || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  // ✅ FIX: Use controlled value instead of watch()
  const [thumbnailUrl, setThumbnailUrl] = useState(product?.thumbnail || "");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Fudgy Brownies Original" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (IDR)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isAvailable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Available for Order</FormLabel>
                    <FormDescription>
                      If unchecked, customers won&apos;t be able to buy this product.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isBestSeller"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Best Seller</FormLabel>
                    <FormDescription>
                      This product will be highlighted on the landing page.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your delicious brownies..." 
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Image</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {thumbnailUrl ? (
                        <div className="relative aspect-square w-full max-w-[200px] overflow-hidden rounded-lg border">
                          <Image
                            src={thumbnailUrl}
                            alt="Product preview"
                            fill
                            className="object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6"
                            onClick={() => {
                              setThumbnailUrl("");
                              field.onChange("");
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 transition-colors hover:bg-muted/50">
                          <UploadButton
                            endpoint="productImage"
                            onClientUploadComplete={(res) => {
                              const url = res[0].url;
                              setThumbnailUrl(url);
                              field.onChange(url);
                              toast({
                                title: "Image uploaded",
                                description: "Product image uploaded successfully",
                              });
                            }}
                            onUploadError={(error: Error) => {
                              toast({
                                title: "Upload failed",
                                description: error.message,
                                variant: "destructive",
                              });
                            }}
                          />
                          <p className="mt-2 text-xs text-muted-foreground">
                            PNG, JPG or WEBP up to 4MB
                          </p>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload a high-quality photo of the brownie.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="submit" disabled={isLoading} className="min-w-[120px]">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {product ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
}