"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Microscope,
  Snowflake,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

const stepIcons = [BadgeCheck, Snowflake, Microscope, TrendingUp];

export function QualityCompliance() {
  const { language } = useLanguage();
  const t = translations[language].quality;

  return (
    <section className="relative px-6 pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="mx-auto max-w-4xl">
        <span className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-sm tracking-wide text-neutral-500">
          {t.eyebrow}
        </span>
        <h1 className="mt-5 text-4xl font-light tracking-tight text-neutral-900 sm:text-5xl">
          {t.headingPlain}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-neutral-900 to-cyan-600">
            {t.headingHighlight}
          </span>
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-500">
          {t.subtitle}
        </p>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {t.steps.map((step, i) => {
            const Icon = stepIcons[i];
            return (
              <div
                key={step.title}
                className="rounded-2xl border border-neutral-200 bg-white/70 p-6 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-teal-100 bg-teal-50">
                    <Icon className="size-5 text-teal-600" strokeWidth={1.5} />
                  </div>
                  <span className="font-mono text-xs text-neutral-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="mt-4 font-medium text-neutral-900">{step.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">
                  {step.body}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-medium text-neutral-900">{t.ctaTitle}</p>
            <p className="mt-1 text-sm text-neutral-500">{t.ctaBody}</p>
          </div>
          <Link
            href="/verify"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-11 shrink-0 rounded-full border-0 bg-gradient-to-r from-teal-500 to-cyan-500 px-6 text-white shadow-[0_8px_20px_rgba(13,148,136,0.25)] hover:from-teal-400 hover:to-cyan-400",
            )}
          >
            {t.ctaButton}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
