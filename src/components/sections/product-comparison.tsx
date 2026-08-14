"use client";

import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

export function ProductComparison() {
  const { language } = useLanguage();
  const t = translations[language].comparison;
  const [featureLabel, ...fieldLabels] = t.headers;

  return (
    <section className="relative px-6 py-14 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-sm tracking-wide text-neutral-500">
            {t.eyebrow}
          </span>
          <h2 className="mt-5 text-3xl font-light tracking-tight text-neutral-900 sm:text-4xl">
            {t.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-500">
            {t.subtitle}
          </p>
        </div>

        {/* Desktop / tablet: real table, scrolls horizontally if the
            viewport is narrower than its content. */}
        <div className="mt-10 hidden overflow-hidden rounded-3xl border border-neutral-200 bg-white/70 backdrop-blur-sm sm:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/70">
                  <th className="px-6 py-4 text-xs font-medium tracking-wide text-neutral-500 uppercase">
                    {featureLabel}
                  </th>
                  {fieldLabels.map((header) => (
                    <th
                      key={header}
                      className="px-6 py-4 text-xs font-medium tracking-wide text-neutral-500 uppercase"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.rows.map((row) => (
                  <tr
                    key={row.name}
                    className="border-b border-neutral-100 transition-colors last:border-0 hover:bg-teal-50/40"
                  >
                    <td className="px-6 py-5 text-sm font-medium text-neutral-900">
                      {row.name}
                    </td>
                    <td className="px-6 py-5 text-sm text-neutral-600">
                      {row.mechanism}
                    </td>
                    <td className="px-6 py-5 text-sm text-neutral-600">
                      {row.administration}
                    </td>
                    <td className="px-6 py-5 text-sm text-neutral-600">
                      {row.primaryTarget}
                    </td>
                    <td className="px-6 py-5 text-sm text-neutral-600">
                      {row.patientProfile}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile: stacked spec cards — a horizontally-scrolled table reads
            poorly at this width, so each row becomes its own card. */}
        <div className="mt-10 flex flex-col gap-4 sm:hidden">
          {t.rows.map((row) => (
            <div
              key={row.name}
              className="rounded-2xl border border-neutral-200 bg-white/70 p-6 backdrop-blur-sm"
            >
              <p className="text-lg font-medium text-neutral-900">{row.name}</p>
              <dl className="mt-4 flex flex-col gap-3 border-t border-neutral-100 pt-4">
                {[
                  [fieldLabels[0], row.mechanism],
                  [fieldLabels[1], row.administration],
                  [fieldLabels[2], row.primaryTarget],
                  [fieldLabels[3], row.patientProfile],
                ].map(([label, value]) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <dt className="text-xs tracking-wide text-neutral-400 uppercase">
                      {label}
                    </dt>
                    <dd className="text-sm text-neutral-700">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
