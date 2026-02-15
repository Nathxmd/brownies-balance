import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={product.thumbnail}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.tags.includes("bestseller") && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-orange-500 hover:bg-orange-600 border-none px-3 py-1">
              BEST SELLER
            </Badge>
          </div>
        )}
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-zinc-900 line-clamp-1">{product.name}</h3>
          <p className="text-zinc-500 text-sm line-clamp-2 mt-2">
            {product.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {product.tags.filter(t => t !== "bestseller").map((tag) => (
            <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 border border-zinc-200 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-2xl font-black text-zinc-900 border-none">
            IDR {Number(product.price).toLocaleString('id-ID')}
          </span>
          <Button asChild size="sm" className="rounded-full bg-zinc-900 hover:bg-zinc-800">
            <Link href={`/order?product=${product.id}`}>Order</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
