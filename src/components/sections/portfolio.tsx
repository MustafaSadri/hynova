"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

export function Portfolio() {
  const { language } = useLanguage();
  const t = translations[language].portfolio;
  const p = t.products;

  // Pens, then vials, then tablets — each row alternates image/content sides.
  const items = [
    { src: "/products/retatrutide-pen.jpg", strengths: t.strengths.retatrutide, ...p.retatrutidePen },
    { src: "/products/tirzepatide-pen.jpg", strengths: t.strengths.tirzepatide, ...p.tirzepatidePen },
    { src: "/products/retatrutide-vial.jpg", strengths: t.strengths.retatrutide, ...p.retatrutideVial },
    { src: "/products/tirzepatide-vial.jpg", strengths: t.strengths.tirzepatide, ...p.tirzepatideVial },
    { src: "/products/orforglipron-tablets.png", strengths: t.strengths.orforglipron, ...p.orforglipron },
  ];

  return (
    <section id="portfolio" className="relative px-6 pt-24 pb-8 md:pt-32 md:pb-12">
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

        <div className="mt-12 flex flex-col gap-6">
          {items.map((item, i) => {
            const reversed = i % 2 === 1;
            return (
              <article
                key={`${item.title}-${item.subtitle}`}
                className="grid grid-cols-1 overflow-hidden rounded-3xl border border-neutral-200 bg-white/70 backdrop-blur-sm md:grid-cols-2"
              >
                <div
                  className={cn(
                    "relative h-64 bg-neutral-50 md:h-auto",
                    reversed && "md:order-2",
                  )}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-contain p-8"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                </div>

                <div
                  className={cn(
                    "flex flex-col justify-center gap-4 p-8 sm:p-10 md:p-12",
                    reversed && "md:order-1",
                  )}
                >
                  <span className="inline-flex w-fit items-center rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-medium tracking-wide text-teal-700">
                    {item.category}
                  </span>

                  <div>
                    <h3 className="text-2xl font-light tracking-tight text-neutral-900 sm:text-3xl">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-neutral-400">
                      {item.subtitle}
                    </p>
                  </div>

                  <p className="text-sm leading-relaxed text-neutral-500">
                    {item.description}
                  </p>

                  <ul className="flex flex-col gap-2">
                    {item.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="flex items-start gap-2 text-sm leading-relaxed text-neutral-600"
                      >
                        <Check
                          className="mt-0.5 size-4 shrink-0 text-teal-600"
                          strokeWidth={2}
                        />
                        {highlight}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-2 border-t border-neutral-100 pt-4 text-xs tracking-wide text-neutral-400 uppercase">
                    {t.strengthsLabel}{" "}
                    <span className="font-medium text-neutral-700 normal-case">
                      {item.strengths}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
