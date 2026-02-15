"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

export function ProblemSolution() {
  const points = [
    {
      problem: "Suka dessert tapi takut diabetes",
      solution: "100% Oat-based & Low sugar",
    },
    {
      problem: "Gluten intolerant & sensitif gandum",
      solution: "Gluten-Free Certified Ingredients",
    },
    {
      problem: "Diet terasa hambar & membosankan",
      solution: "Tetap fudgy, lezat & rich chocolate",
    },
  ];

  return (
    <section id="problem" className="py-24 bg-zinc-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl font-extrabold text-zinc-900 tracking-tight">
            Menikmati Manis <span className="text-orange-500">Gak Harus</span> Beresiko
          </h2>
          <p className="text-zinc-600 text-lg">
            Kami mengerti dilema antara kesehatan dan keinginan makan enak. Itulah mengapa Brownies Balance lahir.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Problem Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-white border border-zinc-100 shadow-sm space-y-8"
          >
            <h3 className="text-2xl font-bold text-zinc-800 flex items-center gap-3">
              <span className="p-2 bg-red-50 rounded-lg text-red-500">❌</span> Masalah Umum
            </h3>
            <ul className="space-y-6">
              {points.map((p, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 border-red-200 flex items-center justify-center text-red-500">
                    <X size={12} strokeWidth={3} />
                  </div>
                  <p className="text-zinc-500 font-medium">{p.problem}</p>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Solution Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-orange-500 text-white shadow-xl shadow-orange-500/20 space-y-8"
          >
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <span className="p-2 bg-white/20 rounded-lg">✅</span> Solusi Kami
            </h3>
            <ul className="space-y-6">
              {points.map((p, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-white flex items-center justify-center text-orange-600">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <p className="text-lg font-bold">{p.solution}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
