"use client";

import {
  Award,
  Building2,
  FlaskConical,
  Globe2,
  HeartHandshake,
  ShieldCheck,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

const missionIcons = [FlaskConical, ShieldCheck, Building2, HeartHandshake];

export function About() {
  const { language } = useLanguage();
  const t = translations[language].about;

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

        <div className="mt-8 space-y-5 text-base leading-relaxed text-neutral-500">
          <p>{t.paragraph1}</p>
          <p>{t.paragraph2}</p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-6 border-y border-neutral-100 py-10 sm:grid-cols-4">
          {t.stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl font-medium text-neutral-900 sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-neutral-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-light tracking-tight text-neutral-900 sm:text-3xl">
            {t.visionHeading}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-500">
            {t.visionText}
          </p>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-light tracking-tight text-neutral-900 sm:text-3xl">
            {t.missionHeading}
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {t.mission.map((item, i) => {
              const Icon = missionIcons[i];
              return (
                <div key={item.title} className="flex gap-4">
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

        <div className="mt-16">
          <span className="inline-flex items-center gap-1.5 text-sm tracking-wide text-neutral-500">
            <Award className="size-4 text-teal-600" />
            {t.advantagesEyebrow}
          </span>
          <h2 className="mt-3 text-2xl font-light tracking-tight text-neutral-900 sm:text-3xl">
            {t.advantagesHeading}
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">
            {t.advantages.map((item) => (
              <div key={item.title}>
                <p className="font-medium text-neutral-900">{item.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-5">
          <Globe2 className="size-5 shrink-0 text-teal-600" />
          <p className="text-sm text-neutral-600">{t.locationNote}</p>
        </div>
      </div>
    </section>
  );
}
