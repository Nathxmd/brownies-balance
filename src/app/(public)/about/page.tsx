"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-16"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight">Kisah Di Balik <br className="hidden md:block" /> <span className="text-orange-500">Brownies Balance</span></h1>
            <p className="text-zinc-500 text-lg max-w-2xl mx-auto italic">
              &quot;Kami percaya bahwa hidup sehat seharusnya tidak membosankan.&quot;
            </p>
          </div>

          {/* Story Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square rounded-[40px] overflow-hidden shadow-2xl">
              <Image 
                src="/hero_brownies_vibrant.png" 
                alt="Our Kitchen" 
                fill 
                className="object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-zinc-900 underline decoration-orange-500 decoration-4 underline-offset-8">Visi Kami</h2>
              <p className="text-zinc-600 leading-relaxed text-lg">
                Dimulai dari tahun 2024, Brownies Balance lahir sebagai jawaban bagi 
                Generasi Z yang peduli pada kesehatan namun tidak ingin kehilangan 
                momen kebahagiaan lewat makanan manis.
              </p>
              <p className="text-zinc-600 leading-relaxed text-lg">
                Kami bereksperimen berbulan-bulan untuk menemukan formula 
                brownies yang tetap &quot;fudgy&quot;, &quot;rich chocolate&quot;, namun tetap 
                &quot;gluten-free&quot; dan &quot;rendah gula&quot; menggunakan bahan dasar oat.
              </p>
            </div>
          </div>

          {/* Values Grid */}
          <div className="bg-zinc-50 rounded-[40px] p-8 md:p-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center border border-zinc-100">
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl text-xl">🌱</div>
              <h3 className="font-bold text-zinc-900">Bahan Alami</h3>
              <p className="text-sm text-zinc-500">Hanya menggunakan oat premium dan pemanis alami berkualitas tinggi.</p>
            </div>
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl text-xl">❤️</div>
              <h3 className="font-bold text-zinc-900">Penuh Cinta</h3>
              <p className="text-sm text-zinc-500">Setiap batch dipanggang segar setiap hari untuk menjamin kualitas rasa.</p>
            </div>
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl text-xl">🚀</div>
              <h3 className="font-bold text-zinc-900">Berorientasi Gen Z</h3>
              <p className="text-sm text-zinc-500">Menyesuaikan dengan gaya hidup aktif dan kebutuhan nutrisi masa kini.</p>
            </div>
          </div>
          
          <div className="text-center py-8">
            <p className="text-zinc-600 mb-8">Siap mencoba keajaiban Brownies Balance?</p>
            <a href="/products" className="inline-flex h-14 items-center justify-center px-8 bg-orange-500 text-white font-black rounded-full shadow-lg shadow-orange-500/20 hover:scale-105 transition-transform">
              Lihat Katalog Produk
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
