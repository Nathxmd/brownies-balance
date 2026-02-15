import { CheckCircle2 } from "lucide-react";

export function Benefits() {
  const benefits = [
    "Aman untuk penderita diabetes",
    "Mendukung Weight Management",
    "Tinggi serat & protein",
    "Ideal untuk Post-workout snack",
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-orange-50 rounded-[40px] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 leading-tight">
              Lebih dari Sekedar <br /> <span className="text-orange-600">Brownies Biasa</span>
            </h2>
            <p className="text-zinc-600">
              Setiap gigitan dirancang untuk menutrisi tubuh Anda tanpa meninggalkan rasa bersalah.
            </p>
          </div>
          <div className="flex-1 grid grid-cols-1 gap-4 w-full">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-orange-100">
                <CheckCircle2 className="text-green-500 w-6 h-6 flex-shrink-0" />
                <span className="font-bold text-zinc-800">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
