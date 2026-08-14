"use client";

import { Award, FlaskConical, Globe2, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

const itemIcons = [Globe2, Award, ShieldCheck, FlaskConical];

export function WhyCynapept() {
  const { language } = useLanguage();
  const t = translations[language].whyUs;

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
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-y border-neutral-200/70 py-10 sm:grid-cols-4">
          {t.items.map((item, i) => {
            const Icon = itemIcons[i];
            return (
              <div key={item.title} className="flex flex-col items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-teal-100 bg-teal-50">
                  <Icon className="size-5 text-teal-600" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-medium text-neutral-900">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-500">
                    {item.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
