"use client";

import { useCartStore } from "@/lib/store/useCartStore";
import { 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSyncExternalStore } from 'react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();
  
  const isMounted = useSyncExternalStore(
    (callback: () => void) => {
      window.addEventListener('resize', callback);
      return () => window.removeEventListener('resize', callback);
    },
    () => true,
    () => false
  );

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-900/40 backdrop-blur-[2px] z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.1)] z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b flex items-center justify-between bg-zinc-50/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                  <ShoppingBag size={20} className="stroke-[2.5px]" />
                </div>
                <h2 className="text-xl font-black text-zinc-900 tracking-tight">KERANJANG</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-zinc-200/50 rounded-full transition-all active:scale-90"
              >
                <X size={24} className="text-zinc-400 hover:text-zinc-600" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-300 relative">
                     <div className="absolute inset-0 bg-zinc-100 rounded-full animate-pulse" />
                    <ShoppingBag size={48} className="relative z-10" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-zinc-900">Wah, Kosong Nih!</h3>
                    <p className="text-zinc-400 text-sm max-w-[200px] mx-auto">Brownies favoritmu menunggu untuk ditambahkan.</p>
                  </div>
                  <Button asChild onClick={onClose} className="rounded-full h-12 px-8 bg-zinc-900 hover:bg-zinc-800 shadow-xl shadow-zinc-200">
                    <Link href="/products" className="font-bold">Mulai Belanja</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={item.id} 
                      className="flex gap-5 group"
                    >
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-zinc-100 flex-shrink-0 shadow-sm border border-zinc-100">
                        <Image
                          src={item.thumbnail}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-110 duration-500"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-0.5">
                        <div className="space-y-1">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-bold text-zinc-900 text-base leading-tight group-hover:text-orange-600 transition-colors">{item.name}</h4>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="text-zinc-300 hover:text-red-500 transition-all p-1 -mr-1"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <p className="text-orange-500 font-black text-sm">
                            IDR {item.price.toLocaleString('id-ID')}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center bg-zinc-100 rounded-xl p-1 border border-zinc-100 shadow-inner">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-lg transition-all text-zinc-500 active:scale-90"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center font-black text-zinc-900 text-sm">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-lg transition-all text-zinc-500 active:scale-90"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider mb-0.5">Subtotal</p>
                             <div className="text-sm font-black text-zinc-900">
                               IDR {(item.price * item.quantity).toLocaleString('id-ID')}
                             </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-8 border-t bg-zinc-50/80 backdrop-blur-md space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-zinc-500 font-medium text-sm">
                    <span>Estimasi Subtotal</span>
                    <span className="text-zinc-400">IDR {getTotalPrice().toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-900 font-bold">Total Pembayaran</span>
                    <span className="text-3xl font-black text-zinc-900 tracking-tighter">
                      IDR {getTotalPrice().toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Button asChild className="w-full h-16 rounded-[24px] bg-zinc-900 hover:bg-zinc-800 text-white text-lg font-black shadow-2xl shadow-zinc-200 group relative overflow-hidden">
                    <Link href="/order" onClick={onClose} className="flex items-center justify-center gap-2">
                       <span className="relative z-10 flex items-center gap-2">
                        Checkout Sekarang
                        <ArrowRight className="group-hover:translate-x-1.5 transition-transform" />
                       </span>
                    </Link>
                  </Button>
                  <div className="flex items-center justify-center gap-2 text-zinc-400">
                     <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                     <p className="text-[11px] font-bold uppercase tracking-widest text-center">
                      Stok Terbatas • Freshly Baked
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
