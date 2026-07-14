"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

type FilterKey = "all" | "injectable" | "lyophilized" | "oral";

const productMeta: {
  imageSrc: string;
  filter: Exclude<FilterKey, "all">;
  accentText: string;
  accentDot: string;
  hoverBorder: string;
  tint: string;
}[] = [
  {
    imageSrc: "/products/retatrutide-injection.png",
    filter: "injectable",
    accentText: "text-purple-600",
    accentDot: "bg-purple-500",
    hoverBorder: "hover:border-purple-500/40",
    tint: "from-purple-500/[0.06]",
  },
  {
    imageSrc: "/products/retatrutide-powder.png",
    filter: "lyophilized",
    accentText: "text-indigo-600",
    accentDot: "bg-indigo-500",
    hoverBorder: "hover:border-indigo-500/40",
    tint: "from-indigo-500/[0.06]",
  },
  {
    imageSrc: "/products/tirzepatide-injection.png",
    filter: "injectable",
    accentText: "text-teal-600",
    accentDot: "bg-teal-500",
    hoverBorder: "hover:border-teal-500/40",
    tint: "from-teal-500/[0.06]",
  },
  {
    imageSrc: "/products/tirzepatide-powder.png",
    filter: "lyophilized",
    accentText: "text-emerald-600",
    accentDot: "bg-emerald-500",
    hoverBorder: "hover:border-emerald-500/40",
    tint: "from-emerald-500/[0.06]",
  },
  {
    imageSrc: "/products/orforglipron-tablets.png",
    filter: "oral",
    accentText: "text-amber-600",
    accentDot: "bg-amber-500",
    hoverBorder: "hover:border-amber-500/40",
    tint: "from-amber-500/[0.06]",
  },
];

const filterLabels: Record<"en" | "ru", Record<FilterKey, string>> = {
  en: {
    all: "All Products",
    injectable: "Injectable",
    lyophilized: "Lyophilized",
    oral: "Oral Tablets",
  },
  ru: {
    all: "Все продукты",
    injectable: "Инъекционные",
    lyophilized: "Лиофилизированные",
    oral: "Таблетки",
  },
};

const filterOrder: FilterKey[] = ["all", "injectable", "lyophilized", "oral"];

export function ProductPortfolio() {
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [quickViewIndex, setQuickViewIndex] = useState<number | null>(null);

  const products = t.portfolio.products;
  const labels = filterLabels[language];

  const visibleProducts = products
    .map((product, index) => ({ product, index }))
    .filter(({ index }) => activeFilter === "all" || productMeta[index].filter === activeFilter);

  // Close quick view on Escape and lock body scroll while it is open
  useEffect(() => {
    if (quickViewIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setQuickViewIndex(null);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [quickViewIndex]);

  const quickView = quickViewIndex !== null ? products[quickViewIndex] : null;
  const quickViewMeta = quickViewIndex !== null ? productMeta[quickViewIndex] : null;

  return (
    <section id="portfolio" className="py-28 md:py-36 relative overflow-hidden bg-background scroll-mt-20">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-14 text-center max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            {t.portfolio.sectionTitle}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            {t.portfolio.subtitle}
          </motion.p>
        </div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mb-16 flex justify-center"
        >
          <div className="inline-flex flex-wrap justify-center gap-1 rounded-full border border-border/60 bg-card p-1.5 shadow-sm">
            {filterOrder.map((key) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`relative rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-300 cursor-pointer focus:outline-none whitespace-nowrap ${
                  activeFilter === key ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {activeFilter === key && (
                  <motion.span
                    layoutId="portfolio-filter-pill"
                    className="absolute inset-0 rounded-full bg-primary shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{labels[key]}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Product catalog grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          <AnimatePresence mode="popLayout">
            {visibleProducts.map(({ product, index }) => {
              const meta = productMeta[index];
              return (
                <motion.article
                  key={product.name}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4 }}
                  className={`group flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm transition-[box-shadow,border-color,transform] duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-foreground/[0.06] ${meta.hoverBorder}`}
                >
                  {/* Product image — primary focus */}
                  <button
                    onClick={() => setQuickViewIndex(index)}
                    className="relative mx-4 mt-4 aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl border border-border/40 bg-white focus:outline-none"
                    aria-label={product.name}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${meta.tint} to-transparent`}></div>
                    <div className="absolute inset-6 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
                      <Image
                        src={meta.imageSrc}
                        alt={product.name}
                        fill
                        className="object-contain drop-shadow-lg"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        preload={index < 3}
                      />
                    </div>
                  </button>

                  {/* Product details */}
                  <div className="flex flex-grow flex-col p-7 md:p-8">
                    <p className={`mb-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] ${meta.accentText}`}>
                      {product.category}
                    </p>
                    <h3 className="mb-3 text-xl md:text-2xl font-bold text-foreground">{product.name}</h3>
                    <p className="mb-8 flex-grow text-[15px] leading-relaxed text-muted-foreground line-clamp-3">
                      {product.description}
                    </p>
                    <button
                      onClick={() => setQuickViewIndex(index)}
                      className="mt-auto inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-foreground/15 px-6 py-3 text-sm font-semibold text-foreground transition-all duration-300 hover:border-foreground hover:bg-foreground hover:text-background focus:outline-none"
                    >
                      {t.portfolio.viewSpecs}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Comparison Table */}
        <div className="mt-28 md:mt-36 max-w-5xl mx-auto">
          <div className="mb-12 text-center">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={language === "ru" ? "text-xl md:text-3xl font-bold mb-4" : "text-2xl md:text-4xl font-bold mb-4"}
            >
              {t.comparisonTable.title}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-muted-foreground text-base max-w-2xl mx-auto"
            >
              {t.comparisonTable.subtitle}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="overflow-x-auto rounded-3xl border border-border/50 bg-card shadow-sm"
          >
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-border/50 bg-secondary/50">
                  <th className="p-5 text-base font-bold text-foreground">
                    {t.comparisonTable.headers.feature}
                  </th>
                  <th className="p-5 text-base font-bold text-foreground text-center">
                    {t.comparisonTable.rows[0].name}
                  </th>
                  <th className="p-5 text-base font-bold text-foreground text-center">
                    {t.comparisonTable.rows[1].name}
                  </th>
                  <th className="p-5 text-base font-bold text-foreground text-center">
                    {t.comparisonTable.rows[2].name}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {/* Mechanism */}
                <tr>
                  <td className="p-5 text-base font-semibold text-foreground">
                    {t.comparisonTable.headers.mechanism}
                  </td>
                  <td className="p-5 text-base text-muted-foreground text-center bg-purple-500/5">
                    {t.comparisonTable.rows[0].mechanism}
                  </td>
                  <td className="p-5 text-base text-muted-foreground text-center bg-teal-500/5">
                    {t.comparisonTable.rows[1].mechanism}
                  </td>
                  <td className="p-5 text-base text-muted-foreground text-center bg-orange-500/5">
                    {t.comparisonTable.rows[2].mechanism}
                  </td>
                </tr>
                {/* Administration */}
                <tr>
                  <td className="p-5 text-base font-semibold text-foreground">
                    {t.comparisonTable.headers.administration}
                  </td>
                  <td className="p-5 text-base text-muted-foreground text-center bg-purple-500/5">
                    {t.comparisonTable.rows[0].administration}
                  </td>
                  <td className="p-5 text-base text-muted-foreground text-center bg-teal-500/5">
                    {t.comparisonTable.rows[1].administration}
                  </td>
                  <td className="p-5 text-base text-muted-foreground text-center bg-orange-500/5">
                    {t.comparisonTable.rows[2].administration}
                  </td>
                </tr>
                {/* Primary Target */}
                <tr>
                  <td className="p-5 text-base font-semibold text-foreground">
                    {t.comparisonTable.headers.target}
                  </td>
                  <td className="p-5 text-base text-foreground font-semibold text-center bg-purple-500/5">
                    {t.comparisonTable.rows[0].target}
                  </td>
                  <td className="p-5 text-base text-foreground font-semibold text-center bg-teal-500/5">
                    {t.comparisonTable.rows[1].target}
                  </td>
                  <td className="p-5 text-base text-foreground font-semibold text-center bg-orange-500/5">
                    {t.comparisonTable.rows[2].target}
                  </td>
                </tr>
                {/* Patient Profile */}
                <tr>
                  <td className="p-5 text-base font-semibold text-foreground">
                    {t.comparisonTable.headers.profile}
                  </td>
                  <td className="p-5 text-base text-muted-foreground text-center bg-purple-500/5">
                    {t.comparisonTable.rows[0].profile}
                  </td>
                  <td className="p-5 text-base text-muted-foreground text-center bg-teal-500/5">
                    {t.comparisonTable.rows[1].profile}
                  </td>
                  <td className="p-5 text-base text-muted-foreground text-center bg-orange-500/5">
                    {t.comparisonTable.rows[2].profile}
                  </td>
                </tr>
              </tbody>
            </table>
          </motion.div>
        </div>
      </div>

      {/* Quick-view dialog */}
      <AnimatePresence>
        {quickView && quickViewMeta && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-md p-4"
            onClick={() => setQuickViewIndex(null)}
            role="dialog"
            aria-modal="true"
            aria-label={quickView.name}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative grid w-full max-w-4xl max-h-[88vh] grid-cols-1 overflow-y-auto rounded-3xl border border-border/50 bg-card shadow-2xl md:grid-cols-2 md:overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute right-4 top-4 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border/50 bg-card text-foreground shadow-sm transition-colors hover:bg-secondary focus:outline-none"
                onClick={() => setQuickViewIndex(null)}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="relative min-h-[280px] bg-white md:min-h-0">
                <div className={`absolute inset-0 bg-gradient-to-br ${quickViewMeta.tint} to-transparent`}></div>
                <div className="absolute inset-10">
                  <Image
                    src={quickViewMeta.imageSrc}
                    alt={quickView.name}
                    fill
                    className="object-contain drop-shadow-xl"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>

              <div className="flex flex-col p-8 md:max-h-[88vh] md:overflow-y-auto md:p-10">
                <p className={`mb-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] ${quickViewMeta.accentText}`}>
                  {quickView.category}
                </p>
                <h3 className="mb-4 text-2xl md:text-3xl font-bold text-foreground">{quickView.name}</h3>
                <p className="mb-8 text-[15px] leading-relaxed text-muted-foreground">{quickView.description}</p>

                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {t.portfolio.specsLabel}
                </p>
                <ul className="space-y-3.5 border-t border-border/40 pt-6">
                  {quickView.specs.map((spec, sIdx) => (
                    <li key={sIdx} className="flex items-start text-[15px] leading-relaxed text-muted-foreground">
                      <span className={`mr-3 mt-2 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full ${quickViewMeta.accentDot}`}></span>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
