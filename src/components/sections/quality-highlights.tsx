"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Microscope, Snowflake, TrendingUp } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

const stepIcons = [BadgeCheck, Snowflake, Microscope, TrendingUp];

export function QualityHighlights() {
  const { language } = useLanguage();
  const t = translations[language].quality;

  return (
    <section className="relative px-6 py-14 md:py-20">
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
            {t.subtitle}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {t.steps.map((step, i) => {
            const Icon = stepIcons[i];
            return (
              <div
                key={step.title}
                className="flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white/70 p-6 backdrop-blur-sm"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-teal-100 bg-teal-50">
                  <Icon className="size-5 text-teal-600" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-medium text-neutral-900">{step.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">
                    {step.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/quality-compliance"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 transition-colors hover:text-teal-800"
          >
            {t.exploreLabel}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
