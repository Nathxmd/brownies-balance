import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  const faqs = [
    { q: "Berapa lama brownies tahan?", a: "Brownies kami tahan 3-4 hari di suhu ruang dan 7-10 hari di dalam kulkas." },
    { q: "Apakah ada minimal order?", a: "Minimal order adalah 1 box (isi 6 atau 12 pcs tergantung varian)." },
    { q: "Area mana saja untuk pengiriman?", a: "Saat ini kami melayani seluruh area Jabodetabek via kurir sameday/instant." },
    { q: "Bagaimana cara melakukan pembayaran?", a: "Kami menerima Transfer Bank (BCA/Mandiri) dan pembayaran E-wallet lainnya." },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl font-extrabold text-zinc-900 mb-12 tracking-tight text-center">Paling Sering <span className="text-orange-500">Ditanyakan</span></h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-bold text-zinc-800 hover:text-orange-600">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-zinc-600 leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
