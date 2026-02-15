export function Testimonials() {
  const reviews = [
    { name: "Sarah", city: "Jakarta", text: "Enak banget! Low sugar tapi tetap manis sempurna! Teksturnya juga fudgy parah.", rating: 5 },
    { name: "Rian", city: "Bandung", text: "Gak nyangka 100% oat bisa seenak ini. Solusi buat yang lagi diet tapi pengen ngemil.", rating: 5 },
    { name: "Maya", city: "Surabaya", text: "Pas banget buat temen kopi pagi. Gak bikin begah dan rasa cokelatnya premium.", rating: 5 },
  ];

  return (
    <section className="py-24 bg-zinc-50 overflow-hidden">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-extrabold text-zinc-900 mb-16 tracking-tight">Apa Kata <span className="text-orange-500">Mereka</span>?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {reviews.map((r, i) => (
            <div key={i} className="p-8 rounded-3xl bg-white border border-zinc-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="flex text-orange-400">
                {[...Array(r.rating)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="text-zinc-600 italic">&quot;{r.text}&quot;</p>
              <div>
                <p className="font-bold text-zinc-900">{r.name}</p>
                <p className="text-xs text-zinc-400 uppercase tracking-widest">{r.city}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
