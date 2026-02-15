"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@prisma/client";
import Image from "next/image";
import { useCartStore } from "@/lib/store/useCartStore";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      thumbnail: product.thumbnail,
    });
    toast.success(`${product.name} ditambahkan ke keranjang`);
  };

  return (
    <div className="group relative bg-white rounded-[32px] border border-zinc-100 shadow-sm overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] hover:-translate-y-2">
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-50">
        <Image
          src={product.thumbnail}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.tags.includes("bestseller") && (
            <Badge className="bg-orange-500 text-white border-none px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg shadow-orange-500/30">
              POPULER
            </Badge>
          )}
          {product.tags.includes("new") && (
            <Badge className="bg-zinc-900 text-white border-none px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg shadow-zinc-900/30">
              BARU
            </Badge>
          )}
        </div>
      </div>

      <div className="p-7 space-y-5">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 mb-1">
            {product.tags.filter(t => t !== "bestseller" && t !== "new").map((tag) => (
              <span key={tag} className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 bg-zinc-50 px-3 py-1 rounded-full border border-zinc-100">
                {tag}
              </span>
            ))}
          </div>
          <h3 className="text-xl font-black text-zinc-900 line-clamp-1 tracking-tight group-hover:text-orange-600 transition-colors">{product.name}</h3>
          <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed font-medium">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-zinc-50">
          <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">Mulai dari</p>
            <span className="text-xl font-black text-zinc-900 tracking-tighter">
              IDR {Number(product.price).toLocaleString('id-ID')}
            </span>
          </div>
          <Button 
            onClick={handleAddToCart}
            size="sm" 
            className="h-12 w-12 rounded-2xl bg-zinc-900 hover:bg-orange-500 text-white shadow-lg shadow-zinc-200 hover:shadow-orange-500/20 transition-all duration-300 active:scale-90 group/btn"
          >
            <ShoppingCart size={20} className="group-hover/btn:scale-110 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
