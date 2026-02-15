import { Hero } from "@/components/public/Hero";
import { Features } from "@/components/public/Features";
import { ProblemSolution } from "@/components/public/ProblemSolution";
import { Benefits } from "@/components/public/Benefits";
import { ProductShowcase } from "@/components/public/ProductShowcase";
import { OrderSteps } from "@/components/public/OrderSteps";
import { Testimonials } from "@/components/public/Testimonials";
import { FAQ } from "@/components/public/FAQ";
import { CTAFinal } from "@/components/public/CTAFinal";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <ProblemSolution />
      <Benefits />
      <ProductShowcase />
      <OrderSteps />
      <Testimonials />
      <FAQ />
      <CTAFinal />
    </>
  );
}
