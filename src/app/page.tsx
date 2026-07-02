import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { TherapeuticFocus } from "@/components/TherapeuticFocus";
import { ProductPortfolio } from "@/components/ProductPortfolio";
import { InnovationScience } from "@/components/InnovationScience";
import { FeaturesSection } from "@/components/FeaturesSection";
import { GlobalFootprint } from "@/components/GlobalFootprint";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <TherapeuticFocus />
      <ProductPortfolio />
      <InnovationScience />
      <FeaturesSection />
      <GlobalFootprint />
      <ContactSection />
      <Footer />
    </main>
  );
}
