"use client";

import { Carousel, Card } from "@/components/ui/specials-linear-carousel";

const products = [
  {
    src: "/products/banner-pen.svg",
    title: "Retatrutide",
    category: "Injectable Pen",
    content: (
      <p className="text-neutral-500">
        Targets GLP-1, GIP, and Glucagon receptors simultaneously for
        superior metabolic regulation.
      </p>
    ),
  },
  {
    src: "/products/banner-vial.svg",
    title: "Retatrutide",
    category: "Lyophilized Vial",
    content: (
      <p className="text-neutral-500">
        High-purity lyophilized formulation for extended stability and
        research use.
      </p>
    ),
  },
  {
    src: "/products/banner-pen.svg",
    title: "Tirzepatide",
    category: "Injectable Pen",
    content: (
      <p className="text-neutral-500">
        Dual-targeted GLP-1 and GIP agonist for clinically validated
        glycemic control.
      </p>
    ),
  },
  {
    src: "/products/banner-vial.svg",
    title: "Tirzepatide",
    category: "Lyophilized Vial",
    content: (
      <p className="text-neutral-500">
        Premium-grade lyophilized compound at the clinical research
        standard.
      </p>
    ),
  },
  {
    src: "/products/orforglipron-tablets.png",
    title: "Orforglipron",
    category: "Oral Tablet",
    content: (
      <p className="text-neutral-500">
        Next-generation oral therapy — effective metabolic support without
        injections.
      </p>
    ),
  },
];

export function Portfolio() {
  const cards = products.map((card, index) => (
    <Card key={card.src + card.title} card={card} index={index} />
  ));

  return (
    <section
      id="portfolio"
      className="relative bg-white px-6 pt-24 pb-8 md:pt-32 md:pb-12"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 max-w-2xl">
          <span className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-sm tracking-wide text-neutral-500">
            Our Portfolio
          </span>
          <h2 className="mt-5 text-4xl font-light tracking-tight text-neutral-900 sm:text-5xl">
            Discover{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-neutral-900 to-cyan-600">
              What&apos;s Possible.
            </span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-neutral-500">
            Five formulations, manufactured and verified to the same
            rigorous standard — across pens, vials, and oral tablets.
          </p>
        </div>

        <div className="w-full h-full py-4">
          <Carousel items={cards} />
        </div>
      </div>
    </section>
  );
}
