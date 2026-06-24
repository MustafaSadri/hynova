import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { ProductPortfolio } from "@/components/ProductPortfolio";
import { InnovationScience } from "@/components/InnovationScience";
import { FeaturesSection } from "@/components/FeaturesSection";
import { GlobalPresence } from "@/components/GlobalPresence";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <HeroSection />
      <AboutSection />
      <ProductPortfolio />
      <InnovationScience />
      <FeaturesSection />
      <GlobalPresence />
      <ContactSection />
      <Footer />
    </main>
  );
}
