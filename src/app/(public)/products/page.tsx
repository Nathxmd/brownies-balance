import { getProducts, getCategories } from "@/lib/actions/product-actions";
import { ProductCard } from "@/components/public/ProductCard";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const { category: categoryId, search } = await searchParams;
  
  const products = await getProducts({ categoryId, search, isAvailable: true });
  const categories = await getCategories();

  return (
    <div className="pt-24 pb-16 min-h-screen bg-zinc-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 space-y-4">
          <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight">Katalog Brownies</h1>
          <p className="text-zinc-500">Pilih varian brownies sehat favorit Anda.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-12">
          <Link href="/products">
            <Badge 
              variant={!categoryId ? "default" : "outline"}
              className="px-4 py-2 cursor-pointer text-sm rounded-full"
            >
              Semua
            </Badge>
          </Link>
          {categories.map((cat) => (
            <Link key={cat.id} href={`/products?category=${cat.id}`}>
              <Badge 
                variant={categoryId === cat.id ? "default" : "outline"}
                className={`px-4 py-2 cursor-pointer text-sm rounded-full ${
                  categoryId === cat.id ? "bg-orange-500 hover:bg-orange-600" : ""
                }`}
              >
                {cat.name}
              </Badge>
            </Link>
          ))}
        </div>

        {/* Results */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed">
            <p className="text-zinc-400 text-lg">Maaf, belum ada produk di kategori ini.</p>
            <Link href="/products" className="text-orange-500 font-bold mt-4 inline-block">
              Lihat semua produk
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
