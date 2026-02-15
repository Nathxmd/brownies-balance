import { getBestSellers } from "@/lib/actions/product-actions";
import { ProductCard } from "./ProductCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export async function ProductShowcase() {
  const products = await getBestSellers(4);

  return (
    <section className="py-24 bg-zinc-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
          <div className="max-w-xl space-y-4">
            <h2 className="text-4xl font-extrabold text-zinc-900 tracking-tight">
              Best Seller <br className="hidden md:block" /> Brownies <span className="text-orange-500">Koleksi</span>
            </h2>
            <p className="text-zinc-600">
              Cek varian favorit pelanggan kami. Semuanya dibuat segar setiap hari dengan bahan premium pilihan.
            </p>
          </div>
          <Button asChild variant="ghost" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50">
            <Link href="/products" className="font-bold">Lihat Semua Produk →</Link>
          </Button>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-zinc-400">
            Belum ada produk favorit saat ini.
          </div>
        )}
      </div>
    </section>
  );
}
