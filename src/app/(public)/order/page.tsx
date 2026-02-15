"use client";

import { useForm } from "react-hook-form";
import { useMemo, useState, Suspense } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
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
import { CheckCircle2, Loader2 } from "lucide-react";

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
  const searchParams = useSearchParams();
  const productId = searchParams.get("product") || undefined;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNum, setOrderNum] = useState("");

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
    setIsSubmitting(true);
    const result = await submitOrder({
      ...data,
      productId
    });
    setIsSubmitting(false);

    if (result.success) {
      setOrderNum(result.orderNumber || "");
      setIsSuccess(true);
      form.reset();
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }
  }

  return (
    <div className="pt-24 pb-16 bg-zinc-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-2xl">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl border border-zinc-100"
            >
              <div className="mb-10 space-y-2 text-center">
                <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Form Pre-Order</h1>
                <p className="text-zinc-500">Silakan lengkapi data pesanan Anda di bawah ini.</p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Lengkap</FormLabel>
                          <FormControl>
                            <Input placeholder="Budi Santoso" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="budi@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nomor WhatsApp</FormLabel>
                        <FormControl>
                          <Input placeholder="081234567890" {...field} />
                        </FormControl>
                        <FormDescription>Untuk koordinasi pengiriman.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alamat Lengkap</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Jl. Brownies No. 123, Kebayoran Baru..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="deliveryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tanggal Pengiriman</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} min={minDeliveryDate} />
                          </FormControl>
                          <FormDescription>Minimal H+2 dari hari ini.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="deliveryTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Waktu Pengiriman</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih waktu" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="MORNING">Pagi (08:00 - 11:00)</SelectItem>
                              <SelectItem value="AFTERNOON">Siang (13:00 - 16:00)</SelectItem>
                              <SelectItem value="EVENING">Sore (17:00 - 20:00)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Catatan Tambahan (Opsional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Contoh: Kurangi topping kacang..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-14 text-lg font-black bg-orange-500 hover:bg-orange-600 rounded-2xl shadow-lg shadow-orange-500/20 transition-transform active:scale-95"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Memproses...</>
                    ) : (
                      "Konfirmasi Pesanan"
                    )}
                  </Button>
                </form>
              </Form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[40px] p-12 shadow-xl border border-zinc-100 text-center space-y-6"
            >
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <CheckCircle2 size={48} />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Order Berhasil Dibuat!</h2>
                <p className="text-zinc-500 text-lg leading-relaxed">
                  Pesanan anda <strong>#{orderNum}</strong> telah kami terima. <br />
                  Silahkan tunggu konfirmasi lewat WhatsApp anda.
                </p>
              </div>
              <Button asChild variant="outline" className="rounded-2xl h-12 px-8">
                <Link href="/">Kembali ke Home</Link>
              </Button>
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
