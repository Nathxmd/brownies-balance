import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Healthy Fudgy Brownies",
  description: "Baking healthy fudgy brownies since 2024. Gourmet brownies with perfectly balanced taste, delivered to your door.",
  openGraph: {
    title: "Brownies Balance | Healthy Fudgy Brownies",
    description: "Baking healthy fudgy brownies since 2024. Gourmet brownies with perfectly balanced taste.",
    url: "https://browniesbalance.com",
    siteName: "Brownies Balance",
    images: [
      {
        url: "/hero_brownies_vibrant.png",
        width: 1200,
        height: 630,
        alt: "Brownies Balance - Premium Fudgy Brownies",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brownies Balance | Healthy Fudgy Brownies",
    description: "Baking healthy fudgy brownies since 2024.",
    images: ["/hero_brownies_vibrant.png"],
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
