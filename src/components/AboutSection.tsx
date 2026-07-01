"use client";

import { motion } from "framer-motion";
import { Activity, Globe, ShieldCheck, Zap } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const icons = [
  <Activity className="w-6 h-6" />,
  <Globe className="w-6 h-6" />,
  <ShieldCheck className="w-6 h-6" />,
  <Zap className="w-6 h-6" />,
];

export function AboutSection() {
  const { t } = useLanguage();

  return (
    <section className="py-24 px-4 relative overflow-hidden bg-background">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-sm uppercase tracking-widest text-primary font-semibold mb-4">{t.about.sectionLabel}</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
              {t.about.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">{t.about.titleHighlight}</span>
            </h3>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">{t.about.p1}</p>
            <p className="text-muted-foreground text-lg leading-relaxed">{t.about.p2}</p>
          </motion.div>

          <div className="grid grid-cols-2 gap-6">
            {t.about.stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-xl border border-border/50 p-6 rounded-2xl hover:bg-card/80 transition-colors shadow-lg shadow-black/5"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {icons[index]}
                </div>
                <div className="text-4xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
