"use client";

import { motion } from "framer-motion";
import { Dna, Atom, Hexagon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function InnovationScience() {
  const { t } = useLanguage();

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Animated Graphic Side */}
          <div className="relative h-[400px] md:h-[600px] w-full flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute w-64 h-64 md:w-96 md:h-96 rounded-full border border-primary/20 flex items-center justify-center border-dashed"
            >
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-48 h-48 md:w-64 md:h-64 rounded-full border border-primary/40 flex items-center justify-center border-dashed"
              >
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-primary/10 backdrop-blur-md border border-primary/50 flex items-center justify-center shadow-[0_0_50px_rgba(0,240,255,0.3)]">
                  <Atom className="w-16 h-16 text-primary animate-pulse" />
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute w-80 h-80 md:w-[500px] md:h-[500px]"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center shadow-lg">
                <Dna className="w-8 h-8 text-purple-500" />
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center shadow-lg">
                <Hexagon className="w-8 h-8 text-emerald-500" />
              </div>
            </motion.div>
          </div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-sm uppercase tracking-widest text-primary font-semibold mb-4">{t.innovation.sectionLabel}</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
              {t.innovation.title} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">{t.innovation.titleHighlight}</span>
            </h3>

            <div className="space-y-8 mt-10">
              {t.innovation.steps.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <span className="text-primary font-bold">0{i + 1}</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-foreground mb-2">{step.title}</h4>
                    <p className="text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
