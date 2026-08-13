"use client";

import { CoverflowCarousel } from "@/components/ui/coverflow-carousel";

const TERAZEPTIDE_STRENGTHS = "2.5 · 5 · 7.5 · 10 · 12.5 · 15 mg";
const RETATRUTIDE_STRENGTHS = "8 · 16 · 24 · 40 mg";
const ORFORGLIPRON_STRENGTHS = "0.8 · 2.5 · 5.5 · 9 · 14.5 · 17.2 mg";

const slides = [
  {
    src: "/products/retatrutide-pen.jpg",
    alt: "Retatrutide injectable pen packaging",
    title: "Retatrutide",
    subtitle: "Injectable Pen",
    meta: [{ label: "Strengths", value: RETATRUTIDE_STRENGTHS }],
  },
  {
    src: "/products/retatrutide-vial.jpg",
    alt: "Retatrutide lyophilized vial packaging",
    title: "Retatrutide",
    subtitle: "Lyophilized Vial",
    meta: [{ label: "Strengths", value: RETATRUTIDE_STRENGTHS }],
  },
  {
    src: "/products/tirzepatide-pen.jpg",
    alt: "Tirzepatide injectable pen packaging",
    title: "Tirzepatide",
    subtitle: "Injectable Pen",
    meta: [{ label: "Strengths", value: TERAZEPTIDE_STRENGTHS }],
  },
  {
    src: "/products/tirzepatide-vial.jpg",
    alt: "Tirzepatide lyophilized vial packaging",
    title: "Tirzepatide",
    subtitle: "Lyophilized Vial",
    meta: [{ label: "Strengths", value: TERAZEPTIDE_STRENGTHS }],
  },
  {
    src: "/products/orforglipron-tablets.png",
    alt: "Orforglipron oral tablets packaging",
    title: "Orforglipron",
    subtitle: "Oral Tablets",
    meta: [{ label: "Strengths", value: ORFORGLIPRON_STRENGTHS }],
  },
];

export function Portfolio() {
  return (
    <section id="portfolio" className="relative bg-white px-6 pt-24 pb-8 md:pt-32 md:pb-12">
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

        <CoverflowCarousel
          slides={slides}
          showCaption
          showNavigation
          showPagination
          label="Cynapept product portfolio"
          className="mt-8"
          cardWidth="clamp(222px, 33vw, 390px)"
        />
      </div>
    </section>
  );
}
