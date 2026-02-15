import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTAFinal() {
  return (
    <section className="py-24 bg-orange-500 text-white relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full" />
      <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-white/10 rounded-full" />
      
      <div className="container mx-auto px-4 text-center relative z-10 space-y-8">
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
          Mulai Hidup Sehat dengan <br /> Brownies Balance
        </h2>
        <p className="text-orange-100 text-xl max-w-2xl mx-auto">
          Jangan tunda lagi keinginan makan enak. Pesan sekarang dan rasakan sendiri keajaiban brownies sehat kami!
        </p>
        <Button asChild size="lg" className="h-16 px-12 text-xl rounded-full bg-white text-orange-600 hover:bg-zinc-100 shadow-2xl font-black transition-transform hover:scale-105">
          <Link href="/products">Pesan Sekarang</Link>
        </Button>
      </div>
    </section>
  );
}
