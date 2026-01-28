"use client";

import Header from "@/components/header";
import Hero from "@/components/hero";
import Features from "@/components/features";
import HowItWorks from "@/components/howitworks";
import Benefits from "@/components/benefits";
import UseCases from "@/components/usecases";
import CTASection from "@/components/ctasection";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Benefits />
        <UseCases />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}