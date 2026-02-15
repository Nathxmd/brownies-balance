import { Wheat, Leaf, Utensils } from "lucide-react";

export function Features() {
  const features = [
    {
      title: "100% Oat-Based",
      description: "Gluten-free dan tinggi serat, baik untuk pencernaan Anda.",
      icon: Wheat,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Low Sugar",
      description: "Menggunakan pemanis alami, aman untuk penderita diabetes.",
      icon: Leaf,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Rasa Premium",
      description: "Kualitas cokelat terbaik dengan tekstur fudgy yang memanjakan lidah.",
      icon: Utensils,
      color: "bg-orange-50 text-orange-600",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, i) => (
            <div key={i} className="text-center space-y-4 group">
              <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${feature.color}`}>
                <feature.icon size={32} />
              </div>
              <h3 className="text-xl font-bold text-zinc-900">{feature.title}</h3>
              <p className="text-zinc-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
