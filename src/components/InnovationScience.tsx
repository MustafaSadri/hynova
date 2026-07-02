"use client";

import { motion } from "framer-motion";
import { FlaskConical, Snowflake, BadgeCheck, BarChart3 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { MoleculeBackground } from "@/components/MoleculeBackground";

const stepIcons = [
  <FlaskConical key="flask" className="w-6 h-6" />,
  <Snowflake key="snowflake" className="w-6 h-6" />,
  <BadgeCheck key="badge" className="w-6 h-6" />,
  <BarChart3 key="chart" className="w-6 h-6" />,
];

const stepColors = [
  { text: "text-teal-600", bg: "bg-teal-50", border: "border-teal-200", glow: "shadow-sm" },
  { text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", glow: "shadow-sm" },
  { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", glow: "shadow-sm" },
  { text: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200", glow: "shadow-sm" },
];

export function InnovationScience() {
  const { t } = useLanguage();

  return (
    <section id="manufacturing" className="py-28 relative overflow-hidden bg-background scroll-mt-20">
      {/* Molecule network */}
      <div className="absolute inset-0 text-primary molecule-bg pointer-events-none">
        <MoleculeBackground />
      </div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Visual side — animated rings */}
          <div className="relative h-[420px] w-full flex items-center justify-center order-2 lg:order-1">
            {/* Outer glow */}
            <div className="absolute w-72 h-72 md:w-96 md:h-96 bg-primary/5 rounded-full blur-3xl" />

            {/* Rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
              className="absolute w-72 h-72 md:w-[380px] md:h-[380px] rounded-full border border-primary/15 border-dashed"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute w-52 h-52 md:w-64 md:h-64 rounded-full border border-cyan-400/20 border-dashed"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="absolute w-36 h-36 md:w-44 md:h-44 rounded-full border border-primary/30"
            />

            {/* Center badge */}
            <div className="relative z-10 w-24 h-24 md:w-28 md:h-28 rounded-full bg-white border-2 border-primary/30 flex flex-col items-center justify-center shadow-[0_0_40px_oklch(0.50_0.16_192/20%)] text-center p-2">
              <BadgeCheck className="w-8 h-8 text-primary mb-0.5" />
              <span className="text-xs text-primary font-bold leading-tight">GMP</span>
              <span className="text-[10px] text-muted-foreground leading-tight">Certified</span>
            </div>

            {/* Orbiting icons */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="absolute w-36 h-36 md:w-44 md:h-44"
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-xl bg-card border border-border/60 flex items-center justify-center shadow-lg">
                <Snowflake className="w-5 h-5 text-blue-400" />
              </div>
            </motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute w-52 h-52 md:w-64 md:h-64"
            >
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-xl bg-card border border-border/60 flex items-center justify-center shadow-lg">
                <BarChart3 className="w-5 h-5 text-violet-400" />
              </div>
            </motion.div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute w-72 h-72 md:w-[380px] md:h-[380px]"
            >
              <div className="absolute top-1/2 -right-6 -translate-y-1/2 w-12 h-12 rounded-xl bg-card border border-border/60 flex items-center justify-center shadow-lg">
                <FlaskConical className="w-5 h-5 text-cyan-400" />
              </div>
            </motion.div>
          </div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2"
          >
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-4">{t.innovation.sectionLabel}</p>
            <h3 className="text-4xl md:text-5xl font-bold mb-2 text-foreground leading-tight">
              {t.innovation.title}
            </h3>
            <h4 className="text-3xl md:text-4xl font-bold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 leading-tight">
              {t.innovation.titleHighlight}
            </h4>

            <div className="space-y-6">
              {t.innovation.steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${stepColors[i].bg} border ${stepColors[i].border} ${stepColors[i].glow} flex items-center justify-center ${stepColors[i].text}`}>
                    {stepIcons[i]}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-foreground mb-1.5">{step.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-20 max-w-5xl mx-auto" />

        {/* Roadmap section */}
        <div className="max-w-5xl mx-auto">
          <div className="mb-16 text-center">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-4xl font-bold mb-4"
            >
              {t.roadmap.title}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-muted-foreground text-sm max-w-2xl mx-auto"
            >
              {t.roadmap.subtitle}
            </motion.p>
          </div>

          <div className="relative">
            {/* Timeline Line (Desktop) */}
            <div className="hidden lg:block absolute top-[27px] left-10 right-10 h-0.5 bg-border/60" />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 relative z-10">
              {t.roadmap.steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="flex lg:flex-col gap-4 lg:gap-0 lg:text-center relative group"
                >
                  {/* Pulse Node */}
                  <div className="flex-shrink-0 flex items-center justify-center lg:mb-6 relative">
                    {/* Vertical line connecting nodes (Mobile only) */}
                    {idx < 3 && (
                      <div className="lg:hidden absolute top-14 bottom-[-40px] left-7 w-0.5 bg-border/60" />
                    )}

                    <div className="w-14 h-14 rounded-full bg-card border-2 border-primary/40 flex items-center justify-center text-primary font-bold shadow-md relative z-10 transition-transform duration-300 group-hover:scale-110">
                      {step.num}
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-primary animate-ping opacity-70" />
                      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary" />
                    </div>
                  </div>

                  {/* Text details */}
                  <div className="flex-grow pt-2 lg:pt-0">
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary uppercase tracking-wider mb-2">
                      {step.status}
                    </span>
                    <h4 className="text-lg font-bold text-foreground mb-2">{step.name}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-[220px] lg:mx-auto">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
