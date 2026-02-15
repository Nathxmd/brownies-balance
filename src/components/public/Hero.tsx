"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-24 pb-16 md:pt-32 md:pb-24">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-orange-100/50 rounded-full blur-3xl opacity-50" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 space-y-8"
          >
            <div className="inline-block px-4 py-1.5 bg-orange-50 text-orange-600 rounded-full text-sm font-semibold tracking-wide uppercase">
              Gluten-Free • Low Sugar • Oat-Based
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-zinc-900 leading-[1.1] tracking-tighter">
              Brownies Sehat <br />
              <span className="text-orange-500">Tanpa Kompromi</span> Rasa
            </h1>
            <p className="text-xl text-zinc-600 max-w-xl mx-auto md:mx-0 leading-relaxed">
              Nikmati kelezatan fudgy brownies premium yang dibuat 100% dari oat. 
              Pilihan cerdas untuk gaya hidup sehat Gen Z tanpa rasa bersalah.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center md:items-start justify-center md:justify-start pt-4">
              <Button asChild size="lg" className="h-14 px-8 text-lg rounded-full bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20">
                <Link href="/products">Pesan Sekarang</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-zinc-200 hover:bg-zinc-50 transition-all">
                <Link href="#problem">Kenapa Kami?</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: "spring" }}
            className="flex-1 relative w-full aspect-square max-w-[500px]"
          >
            <div className="absolute inset-0 bg-orange-500 rounded-3xl rotate-6 -z-10 opacity-10" />
            <div className="relative h-full w-full overflow-hidden rounded-3xl shadow-2xl shadow-orange-950/20">
              <Image
                src="/hero_brownies_vibrant.png"
                alt="Delicious Fudgy Brownies"
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
