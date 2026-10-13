"use client";

import Link from "next/link";
import { Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

// Placeholder page — the real pre-booking flow isn't built yet. This exists
// so a QR code pointing at /prebook can already be sent to print (on
// packaging, stickers, etc.) before the actual feature ships; scanning it
// just shows a "coming soon" notice until this page is replaced.
export function PreBook() {
  const { language } = useLanguage();
  const t = translations[language].prebook;

  return (
    <section className="relative px-6 pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="mx-auto max-w-xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-sm tracking-wide text-teal-700">
            <Sparkles className="size-3.5" />
            {t.eyebrow}
          </span>
          <h1 className="mt-6 text-4xl font-light tracking-tight text-neutral-900 sm:text-5xl">
            {t.headingPlain}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-neutral-900 to-cyan-600">
              {t.headingHighlight}
            </span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-neutral-500">
            {t.subtitle}
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-neutral-200 bg-white/70 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:p-8">
          <div className="flex flex-col items-center py-6 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-teal-50">
              <Clock className="size-7 text-teal-600" strokeWidth={1.5} />
            </div>
            <h2 className="mt-5 text-xl font-medium text-neutral-900">{t.statusTitle}</h2>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-neutral-500">
              {t.statusBody}
            </p>
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "mt-6 h-11 rounded-full border-neutral-200 px-6 text-neutral-700 hover:bg-neutral-50",
              )}
            >
              {t.returnHome}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
