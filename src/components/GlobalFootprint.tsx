"use client";

import { motion } from "framer-motion";
import { Globe2, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const phaseColors = [
  {
    accent: "text-teal-700",
    bg: "bg-teal-50",
    border: "border-teal-200",
    glowBorder: "hover:border-teal-300",
    badge: "bg-teal-100 text-teal-700 border-teal-200",
    number: "text-teal-600",
    glow: "shadow-lg shadow-teal-100",
    active: true,
  },
  {
    accent: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    glowBorder: "hover:border-blue-300",
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    number: "text-blue-500",
    glow: "shadow-md shadow-blue-50",
    active: false,
  },
  {
    accent: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
    glowBorder: "hover:border-violet-300",
    badge: "bg-violet-100 text-violet-700 border-violet-200",
    number: "text-violet-400",
    glow: "shadow-sm",
    active: false,
  },
];

export function GlobalFootprint() {
  const { t, language } = useLanguage();
  const gf = t.globalFootprint;

  return (
    <section id="global-footprint" className="py-28 relative overflow-hidden bg-background scroll-mt-20">
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(currentColor 1px, transparent 1px),
            linear-gradient(90deg, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          color: "oklch(0.72 0.17 192)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-6"
          >
            <Globe2 className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary tracking-widest uppercase">{gf.sectionLabel}</span>
          </motion.div>

          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-foreground leading-tight mb-2"
          >
            {gf.title}
          </motion.h3>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 mb-6 leading-tight"
          >
            {gf.titleHighlight}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed"
          >
            {gf.subtitle}
          </motion.p>
        </div>

        {/* Phase cards */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-12 left-[calc(16.666%+1.5rem)] right-[calc(16.666%+1.5rem)] h-px bg-gradient-to-r from-primary/40 via-blue-400/40 to-violet-400/40" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {gf.phases.map((phase, index) => {
              const c = phaseColors[index];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className={`relative rounded-2xl bg-card border ${c.border} ${c.glowBorder} ${c.glow} transition-all duration-400 hover:-translate-y-2 p-8 overflow-hidden group`}
                >
                  {/* Background gradient on hover */}
                  <div className={`absolute inset-0 ${c.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  {/* Phase number + status */}
                  <div className="relative z-10 flex items-start justify-between mb-6">
                    <span className={`text-5xl font-black ${c.number} opacity-20`}>{String(index + 1).padStart(2, "0")}</span>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${c.badge} flex items-center gap-1.5`}>
                      {c.active && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
                      {phase.status}
                    </span>
                  </div>

                  <div className="relative z-10">
                    <p className={`text-xs uppercase tracking-widest font-semibold ${c.accent} mb-2`}>{phase.phase}</p>
                    <h4 className={language === "ru" ? "text-base font-bold text-foreground mb-3" : "text-xl font-bold text-foreground mb-3"}>{phase.title}</h4>
                    <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{phase.description}</p>

                    {/* Region tags */}
                    <div className="flex flex-wrap gap-2">
                      {phase.regions.map((region) => (
                        <span
                          key={region}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-secondary border border-border text-muted-foreground"
                        >
                          <CheckCircle2 className={`w-2.5 h-2.5 ${c.accent}`} />
                          {region}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
