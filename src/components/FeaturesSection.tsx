"use client";

import { motion } from "framer-motion";
import { CheckCircle2, FlaskConical, Globe2, Handshake, Truck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const icons = [
  <CheckCircle2 className="w-8 h-8" />,
  <FlaskConical className="w-8 h-8" />,
  <Truck className="w-8 h-8" />,
  <Globe2 className="w-8 h-8" />,
  <Handshake className="w-8 h-8" />,
];

const colors = [
  { text: "text-blue-500", bg: "bg-blue-500/10", border: "group-hover:border-blue-500/50" },
  { text: "text-cyan-500", bg: "bg-cyan-500/10", border: "group-hover:border-cyan-500/50" },
  { text: "text-emerald-500", bg: "bg-emerald-500/10", border: "group-hover:border-emerald-500/50" },
  { text: "text-purple-500", bg: "bg-purple-500/10", border: "group-hover:border-purple-500/50" },
  { text: "text-pink-500", bg: "bg-pink-500/10", border: "group-hover:border-pink-500/50" },
];

export function FeaturesSection() {
  const { t } = useLanguage();

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background/0 to-background/0 -z-10"></div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm uppercase tracking-widest text-primary font-semibold mb-4"
          >
            {t.features.sectionLabel}
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-6 text-foreground"
          >
            {t.features.sectionTitle}
          </motion.h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.features.items.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group relative p-8 rounded-3xl bg-card border border-border/50 transition-all duration-500 hover:-translate-y-2 ${colors[index].border} overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className={`w-16 h-16 rounded-2xl ${colors[index].bg} flex items-center justify-center mb-6 border border-primary/10`}>
                <div className={colors[index].text}>{icons[index]}</div>
              </div>
              <h4 className="text-2xl font-bold text-foreground mb-4 relative z-10">{feature.title}</h4>
              <p className="text-muted-foreground relative z-10">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
