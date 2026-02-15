export function OrderSteps() {
  const steps = [
    { title: "Pilih Produk", description: "Pilih brownies favorit Anda di katalog." },
    { title: "Isi Form", description: "Lengkapi data pengiriman dan waktu pre-order." },
    { title: "Bayar", description: "Lakukan pembayaran via transfer atau lainnya." },
    { title: "Terima Brownies", description: "Brownies sehat siap dinikmati di rumah." },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
            Cara <span className="text-orange-500">Pesan</span> Mudah
          </h2>
          <p className="text-zinc-500">Hanya butuh 4 langkah mudah untuk menikmati brownies sehat kami.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-orange-100 -translate-y-12 z-0" />
          
          {steps.map((step, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center space-y-4 group">
              <div className="w-16 h-16 rounded-full bg-orange-500 text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                {i + 1}
              </div>
              <h3 className="text-xl font-bold text-zinc-900">{step.title}</h3>
              <p className="text-zinc-500 text-sm max-w-[200px]">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
