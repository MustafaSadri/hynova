"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

export function AboutHighlights() {
  const { language } = useLanguage();
  const t = translations[language].about;

  return (
    <section className="relative px-6 pt-24 pb-8 md:pt-32 md:pb-12">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-sm tracking-wide text-neutral-500">
            {t.eyebrow}
          </span>
          <h2 className="mt-5 text-3xl font-light tracking-tight text-neutral-900 sm:text-4xl">
            {t.headingPlain}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-neutral-900 to-cyan-600">
              {t.headingHighlight}
            </span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-500">
            {t.paragraph1}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-6 border-y border-neutral-200/70 py-8 sm:grid-cols-4">
          {t.stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl font-medium text-neutral-900 sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-neutral-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/about"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 transition-colors hover:text-teal-800"
          >
            {t.learnMoreLabel}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
