"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Pesan Terkirim!",
      description: "Terima kasih telah menghubungi kami. Tim kami akan segera merespon.",
    });
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-zinc-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12"
        >
          {/* Contact Info */}
          <div className="space-y-12">
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight">Hubungi Kami</h1>
              <p className="text-zinc-500 text-lg">
                Punya pertanyaan atau ingin bekerjasama? Kami siap mendengarkan Anda.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-orange-500 border border-zinc-100 flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900">Email</h3>
                  <p className="text-zinc-500">hello@browniesbalance.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-orange-500 border border-zinc-100 flex-shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900">WhatsApp</h3>
                  <p className="text-zinc-500">0812-3456-7890</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-orange-500 border border-zinc-100 flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900">Office</h3>
                  <p className="text-zinc-500 italic">Jakarta Selatan, Indonesia</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl border border-zinc-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700">Nama Lengkap</label>
                <Input placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700">Email</label>
                <Input type="email" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700">Pesan</label>
                <Textarea placeholder="Tuliskan pesan Anda di sini..." className="min-h-[150px]" />
              </div>
              <Button type="submit" className="w-full h-14 text-lg font-black bg-orange-500 hover:bg-orange-600 rounded-2xl shadow-lg shadow-orange-500/20">
                <Send className="mr-2 w-5 h-5" /> Kirim Pesan
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
