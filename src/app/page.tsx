import { Hero } from "@/components/sections/hero";
import { AboutHighlights } from "@/components/sections/about-highlights";
import { WhyCynapept } from "@/components/sections/why-cynapept";
import { Portfolio } from "@/components/sections/portfolio";
import { ProductComparison } from "@/components/sections/product-comparison";
import { QualityHighlights } from "@/components/sections/quality-highlights";
import { Contact } from "@/components/sections/contact";
import { EventPopup } from "@/components/sections/event-popup";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <EventPopup />
      <Hero />
      <AboutHighlights />
      <WhyCynapept />
      <Portfolio />
      <ProductComparison />
      <QualityHighlights />
      <Contact />
    </div>
  );
}
