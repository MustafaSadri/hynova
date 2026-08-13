"use client";

import { CoverflowCarousel } from "@/components/ui/coverflow-carousel";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

export function Portfolio() {
  const { language } = useLanguage();
  const t = translations[language].portfolio;
  const p = t.products;

  const slides = [
    {
      src: "/products/retatrutide-pen.jpg",
      alt: p.retatrutidePen.alt,
      title: p.retatrutidePen.title,
      subtitle: p.retatrutidePen.subtitle,
      meta: [{ label: t.strengthsLabel, value: t.strengths.retatrutide }],
    },
    {
      src: "/products/retatrutide-vial.jpg",
      alt: p.retatrutideVial.alt,
      title: p.retatrutideVial.title,
      subtitle: p.retatrutideVial.subtitle,
      meta: [{ label: t.strengthsLabel, value: t.strengths.retatrutide }],
    },
    {
      src: "/products/tirzepatide-pen.jpg",
      alt: p.tirzepatidePen.alt,
      title: p.tirzepatidePen.title,
      subtitle: p.tirzepatidePen.subtitle,
      meta: [{ label: t.strengthsLabel, value: t.strengths.tirzepatide }],
    },
    {
      src: "/products/tirzepatide-vial.jpg",
      alt: p.tirzepatideVial.alt,
      title: p.tirzepatideVial.title,
      subtitle: p.tirzepatideVial.subtitle,
      meta: [{ label: t.strengthsLabel, value: t.strengths.tirzepatide }],
    },
    {
      src: "/products/orforglipron-tablets.png",
      alt: p.orforglipron.alt,
      title: p.orforglipron.title,
      subtitle: p.orforglipron.subtitle,
      meta: [{ label: t.strengthsLabel, value: t.strengths.orforglipron }],
    },
  ];

  return (
    <section id="portfolio" className="relative bg-white px-6 pt-24 pb-8 md:pt-32 md:pb-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 max-w-2xl">
          <span className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-sm tracking-wide text-neutral-500">
            {t.eyebrow}
          </span>
          <h2 className="mt-5 text-4xl font-light tracking-tight text-neutral-900 sm:text-5xl">
            {t.headingPlain}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-neutral-900 to-cyan-600">
              {t.headingHighlight}
            </span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-neutral-500">
            {t.subtitle}
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
