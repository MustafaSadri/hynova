import { Hero } from "@/components/sections/hero";
import { Portfolio } from "@/components/sections/portfolio";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <Hero />
      <Portfolio />
      <Contact />
    </div>
  );
}
