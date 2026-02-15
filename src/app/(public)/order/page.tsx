"use client";

import { useForm } from "react-hook-form";
import { useMemo, useState, Suspense, useSyncExternalStore } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { submitOrder } from "@/lib/actions/order-actions";
import { CheckCircle2, Loader2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";

const orderSchema = z.object({
  customerName: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  phone: z.string().min(10, "Nomor WhatsApp tidak valid"),
  address: z.string().min(10, "Alamat lengkap diperlukan"),
  city: z.string().min(1, "Kota wajib diisi"),
  deliveryDate: z.string().min(1, "Tanggal pengiriman wajib dipilih"),
  deliveryTime: z.enum(["MORNING", "AFTERNOON", "EVENING"]),
  notes: z.string().optional(),
});

type OrderFormValues = z.infer<typeof orderSchema>;

function OrderFormContent() {
  const { toast } = useToast();
  const { items, getTotalPrice, clearCart } = useCartStore();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNum, setOrderNum] = useState("");
  
  const isMounted = useSyncExternalStore(
    (callback: () => void) => {
      window.addEventListener('resize', callback);
      return () => window.removeEventListener('resize', callback);
    },
    () => true,
    () => false
  );

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerName: "",
      email: "",
      phone: "",
      address: "",
      city: "Jakarta",
      deliveryDate: "",
      deliveryTime: "AFTERNOON",
      notes: "",
    },
  });

  const minDeliveryDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 2); // H+2
    return date.toISOString().split('T')[0];
  }, []);

  async function onSubmit(data: OrderFormValues) {
    if (items.length === 0) {
      toast({
        title: "Keranjang Kosong",
        description: "Silakan pilih produk terlebih dahulu.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const result = await submitOrder({
      ...data,
      items: items.map(i => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity
      }))
    });
    setIsSubmitting(false);

    if (result.success) {
      setOrderNum(result.orderNumber || "");
      setIsSuccess(true);
      clearCart();
      form.reset();
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }
  }

  if (!isMounted) return null;

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="pt-32 pb-16 bg-zinc-50 min-h-screen text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto space-y-6">
             <div className="w-24 h-24 bg-zinc-200 rounded-full flex items-center justify-center mx-auto text-zinc-500">
               <ShoppingBag size={48} />
             </div>
             <div className="space-y-2">
               <h1 className="text-3xl font-black text-zinc-900">Keranjang Kosong</h1>
               <p className="text-zinc-500">Wah, sepertinya Anda belum memilih brownies favorit Anda.</p>
             </div>
             <Button asChild className="rounded-full h-12 px-8">
               <Link href="/products">Mari Belanja!</Link>
             </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-zinc-50/50 min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
            >
              {/* Form Section */}
              <div className="lg:col-span-7 bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-zinc-100">
                <div className="mb-12">
                  <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-2">Data Pesanan</h1>
                  <p className="text-zinc-500 font-medium">Lengkapi detail pengiriman untuk brownies favorit Anda.</p>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="customerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-zinc-700 font-bold uppercase text-[11px] tracking-wider">Nama Lengkap</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Budi Santoso" 
                                className="h-12 border-zinc-200 rounded-xl focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-zinc-50/30" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage className="text-xs font-medium" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-zinc-700 font-bold uppercase text-[11px] tracking-wider">Email</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="budi@example.com" 
                                className="h-12 border-zinc-200 rounded-xl focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-zinc-50/30" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage className="text-xs font-medium" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-700 font-bold uppercase text-[11px] tracking-wider">Nomor WhatsApp</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="081234567890" 
                              className="h-12 border-zinc-200 rounded-xl focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-zinc-50/30 font-medium" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription className="text-[11px]">Kami akan menghubungi nomor ini untuk konfirmasi.</FormDescription>
                          <FormMessage className="text-xs font-medium" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-700 font-bold uppercase text-[11px] tracking-wider">Alamat Lengkap</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Jl. Brownies No. 123, Kebayoran Baru..." 
                              className="min-h-[100px] border-zinc-200 rounded-xl focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-zinc-50/30 resize-none p-4" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-xs font-medium" />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
                      <FormField
                        control={form.control}
                        name="deliveryDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-zinc-700 font-bold uppercase text-[11px] tracking-wider">Tanggal Pengiriman</FormLabel>
                            <FormControl>
                              <Input 
                                type="date" 
                                className="h-12 border-zinc-200 rounded-xl focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-zinc-50/30" 
                                {...field} 
                                min={minDeliveryDate} 
                              />
                            </FormControl>
                            <FormDescription className="text-[11px]">H+2 dari hari ini.</FormDescription>
                            <FormMessage className="text-xs font-medium" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="deliveryTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-zinc-700 font-bold uppercase text-[11px] tracking-wider">Waktu Pengiriman</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 border-zinc-200 rounded-xl focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-zinc-50/30">
                                  <SelectValue placeholder="Pilih waktu" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-xl border-zinc-100 shadow-xl">
                                <SelectItem value="MORNING">Pagi (08:00 - 11:00)</SelectItem>
                                <SelectItem value="AFTERNOON">Siang (13:00 - 16:00)</SelectItem>
                                <SelectItem value="EVENING">Sore (17:00 - 20:00)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-xs font-medium" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-700 font-bold uppercase text-[11px] tracking-wider">Catatan Tambahan</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Contoh: Kurangi topping kacang..." 
                              className="h-12 border-zinc-200 rounded-xl focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-zinc-50/30" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-xs font-medium" />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full h-14 text-lg font-black bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl shadow-xl shadow-zinc-200 transition-all active:scale-95 group"
                    >
                      {isSubmitting ? (
                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Memproses...</>
                      ) : (
                        <span className="flex items-center gap-2">
                          Konfirmasi Pesanan
                          <CheckCircle2 size={20} className="text-orange-500 group-hover:scale-110 transition-transform" />
                        </span>
                      )}
                    </Button>
                  </form>
                </Form>
              </div>

              {/* Order Summary Section */}
              <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-32">
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-zinc-100 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50" />
                  
                  <h2 className="text-2xl font-black text-zinc-900 tracking-tight mb-8 relative">Ringkasan Order</h2>
                  
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 -mr-4 scrollbar-hide mb-8">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4 p-3 rounded-2xl hover:bg-zinc-50 transition-colors border border-transparent hover:border-zinc-100 group">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-100 flex-shrink-0 relative border border-zinc-100 shadow-sm">
                          <Image src={item.thumbnail} alt={item.name} fill className="object-cover transition-transform group-hover:scale-105" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center min-w-0">
                          <p className="font-bold text-zinc-900 leading-tight truncate">{item.name}</p>
                          <p className="text-xs text-zinc-500 font-medium mt-1">
                            {item.quantity} × <span className="text-orange-600">IDR {item.price.toLocaleString('id-ID')}</span>
                          </p>
                        </div>
                        <div className="flex flex-col justify-center text-right">
                          <p className="font-black text-zinc-900 text-sm whitespace-nowrap">
                            IDR {(item.price * item.quantity).toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-8 border-t border-zinc-100 space-y-4">
                     <div className="flex justify-between items-center text-zinc-500 text-sm font-medium">
                        <span>Subtotal</span>
                        <span className="text-zinc-900">IDR {getTotalPrice().toLocaleString('id-ID')}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-zinc-500 text-sm font-medium">Layanan Antar</span>
                        <span className="text-[11px] font-bold bg-zinc-100 text-zinc-500 px-3 py-1 rounded-full uppercase tracking-wider">
                          Nanti via WhatsApp
                        </span>
                     </div>
                     <div className="pt-4 mt-4 border-t-2 border-dashed border-zinc-100 flex justify-between items-end">
                        <div>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-1">Total Estimasi</p>
                          <p className="text-3xl font-black text-zinc-900 tracking-tighter">
                            IDR {getTotalPrice().toLocaleString('id-ID')}
                          </p>
                        </div>
                        <div className="p-3 bg-zinc-900 rounded-2xl text-white">
                          <ShoppingBag size={24} />
                        </div>
                     </div>
                  </div>
                </div>

                {/* Info Card */}
                <div className="bg-orange-500 rounded-[24px] p-6 text-white shadow-lg shadow-orange-500/20 flex gap-4 items-center">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={24} />
                  </div>
                  <p className="text-sm font-bold leading-tight">Semua brownies dipanggang segar <br />sesuai urutan pesanan.</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[40px] p-12 md:p-20 shadow-xl border border-zinc-100 text-center space-y-8 max-w-2xl mx-auto"
            >
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 relative">
                   <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20"
                   />
                  <CheckCircle2 size={56} className="relative z-10" />
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-black text-zinc-900 tracking-tight">Order Berhasil!</h2>
                <div className="p-6 bg-zinc-50 rounded-[24px] border border-zinc-100 inline-block px-10">
                   <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">Nomor Pesanan</p>
                   <p className="text-2xl font-black text-orange-500 tracking-tight">#{orderNum}</p>
                </div>
                <p className="text-zinc-500 text-lg leading-relaxed max-w-md mx-auto">
                  Terima kasih telah memesan. Kami akan segera menghubungi Anda via <strong>WhatsApp</strong> untuk langkah selanjutnya.
                </p>
              </div>
              <div className="pt-4">
                <Button asChild variant="outline" className="rounded-2xl h-14 px-10 border-zinc-200 hover:bg-zinc-50 text-base font-bold transition-all">
                  <Link href="/">Kembali ke Beranda</Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center">Loading form...</div>}>
      <OrderFormContent />
    </Suspense>
  );
}
