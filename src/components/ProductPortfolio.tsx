"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

const productMeta = [
  { imageSrc: "/products/retatrutide-injection.png", gradient: "from-purple-500/20 to-purple-800/20", border: "group-hover:border-purple-500/50" },
  { imageSrc: "/products/retatrutide-powder.png", gradient: "from-indigo-500/20 to-blue-800/20", border: "group-hover:border-indigo-500/50" },
  { imageSrc: "/products/tirzepatide-injection.png", gradient: "from-teal-500/20 to-emerald-800/20", border: "group-hover:border-teal-500/50" },
  { imageSrc: "/products/tirzepatide-powder.png", gradient: "from-emerald-500/20 to-green-800/20", border: "group-hover:border-emerald-500/50" },
  { imageSrc: "/products/orforglipron-tablets.png", gradient: "from-orange-500/20 to-amber-800/20", border: "group-hover:border-orange-500/50" },
];

export function ProductPortfolio() {
  const { t, language } = useLanguage();
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const toggleFlip = (index: number) => {
    setFlippedCards((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const products = t.portfolio.products;

  return (
    <section id="portfolio" className="py-28 relative overflow-hidden bg-background scroll-mt-20">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-16 text-center max-w-3xl mx-auto">
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

        <div className="flex overflow-x-auto pb-12 -mx-4 px-4 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:overflow-visible md:snap-none md:px-0 md:mx-0 hide-scrollbar">
          {products.map((product, index) => {
            const meta = productMeta[index];
            return (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group flex-none w-[90vw] md:w-auto snap-center mr-4 md:mr-0 last:mr-0 perspective-1000 transition-all duration-500 hover:-translate-y-1"
              >
                <div className={`flip-card-inner ${flippedCards[index] ? 'flipped' : ''}`}>

                  {/* Front Side */}
                  <div className={`card-front flex flex-col rounded-3xl border border-border/50 bg-card overflow-hidden ${meta.border} backface-hidden`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${meta.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    <div className="relative z-10 flex flex-col h-full">
                      <div
                        onClick={(e) => { e.stopPropagation(); setSelectedImage(meta.imageSrc); }}
                        className="relative mx-4 mt-4 aspect-[4/3] bg-white p-6 overflow-hidden cursor-zoom-in rounded-2xl border border-border/30"
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent mix-blend-multiply z-10 pointer-events-none"></div>
                        <div className="relative w-full h-full transform transition-transform duration-700 group-hover:scale-105">
                          <Image src={meta.imageSrc} alt={product.name} fill className="object-contain drop-shadow-xl" sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 33vw" priority={index < 3} />
                        </div>
                      </div>
                      <div className="p-8 flex flex-col flex-grow">
                        <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-2">{product.category}</h3>
                        <h4 className="text-2xl font-bold text-foreground mb-4">{product.name}</h4>
                        <p className="text-muted-foreground mb-8 flex-grow text-[17px] leading-relaxed">{product.description}</p>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleFlip(index); }}
                          className="flex items-center text-sm font-medium text-foreground mt-auto opacity-70 group-hover:opacity-100 transition-opacity cursor-pointer text-left bg-transparent border-none p-0 focus:outline-none"
                        >
                          {t.portfolio.viewSpecs} <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Back Side */}
                  <div className={`card-back flex flex-col rounded-3xl border border-border/50 bg-card overflow-hidden ${meta.border} backface-hidden rotate-y-180`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${meta.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    <div className="relative z-10 flex flex-col h-full p-8">
                      <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-2">{t.portfolio.specsLabel}</h3>
                      <h4 className="text-2xl font-bold text-foreground mb-6">{product.name}</h4>
                      <ul className="space-y-4 mb-8 flex-grow">
                        {product.specs.map((spec, sIdx) => (
                          <li key={sIdx} className="flex items-start text-[15px] text-muted-foreground leading-relaxed text-left">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mr-3 flex-shrink-0 mt-2"></span>
                            <span>{spec}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFlip(index); }}
                        className="flex items-center text-sm font-medium text-foreground mt-auto opacity-70 group-hover:opacity-100 transition-opacity cursor-pointer text-left bg-transparent border-none p-0 focus:outline-none"
                      >
                        <ArrowLeft className="mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        {t.portfolio.backToOverview}
                      </button>
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Comparison Table */}
        <div className="mt-28 max-w-5xl mx-auto">
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

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .rotate-y-180 { -webkit-transform: rotateY(180deg); transform: rotateY(180deg); }
        .flip-card-inner { display: grid; grid-template-columns: 100%; grid-template-rows: 100%; -webkit-transition: -webkit-transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); -webkit-transform-style: preserve-3d; transform-style: preserve-3d; }
        .flip-card-inner.flipped { -webkit-transform: rotateY(180deg); transform: rotateY(180deg); }
        .card-front, .card-back { grid-area: 1 / 1 / 2 / 2; backface-visibility: hidden; -webkit-backface-visibility: hidden; -webkit-transform-style: preserve-3d; transform-style: preserve-3d; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.25s ease-out forwards; }
      `}} />

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 cursor-zoom-out animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[85vh] aspect-[4/3] w-full bg-white p-4 rounded-3xl shadow-2xl flex items-center justify-center cursor-default animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center focus:outline-none transition-colors z-20 cursor-pointer text-lg font-bold"
              onClick={() => setSelectedImage(null)}
            >✕</button>
            <div className="relative w-full h-full">
              <Image src={selectedImage} alt="Product Detail" fill className="object-contain" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
