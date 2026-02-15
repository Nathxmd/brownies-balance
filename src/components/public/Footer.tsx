import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-zinc-950 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <Link href="/" className="text-2xl font-bold tracking-tighter">
            Brownies<span className="text-orange-500">Balance</span>
          </Link>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Brownies gluten-free & low sugar untuk Gen Z. Sehat tanpa kompromi rasa. 
            Dibuat 100% dari bahan dasar oat berkualitas.
          </p>
        </div>

        <div>
          <h4 className="font-bold mb-6">Quick Links</h4>
          <ul className="space-y-3 text-sm text-zinc-400">
            <li><Link href="/" className="hover:text-orange-500 transition-colors">Home</Link></li>
            <li><Link href="/products" className="hover:text-orange-500 transition-colors">Products</Link></li>
            <li><Link href="/about" className="hover:text-orange-500 transition-colors">About Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6">Support</h4>
          <ul className="space-y-3 text-sm text-zinc-400">
            <li><Link href="/faq" className="hover:text-orange-500 transition-colors">FAQ</Link></li>
            <li><Link href="/order" className="hover:text-orange-500 transition-colors">Order Policy</Link></li>
            <li><Link href="/contact" className="hover:text-orange-500 transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6">Contact</h4>
          <ul className="space-y-3 text-sm text-zinc-400">
            <li>Jakarta, Indonesia</li>
            <li>IG: @browniesbalance</li>
            <li>WA: 0812-3456-7890</li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-16 pt-8 border-t border-zinc-900 text-center text-xs text-zinc-500 uppercase tracking-widest">
        © {new Date().getFullYear()} Brownies Balance. All rights reserved.
      </div>
    </footer>
  );
}
