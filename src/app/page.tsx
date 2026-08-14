import { Hero } from "@/components/sections/hero";
import { WhyCynapept } from "@/components/sections/why-cynapept";
import { Portfolio } from "@/components/sections/portfolio";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <Hero />
      <WhyCynapept />
      <Portfolio />
      <Contact />
    </div>
  );
}
