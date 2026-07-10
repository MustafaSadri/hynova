"use client";

import { motion } from "framer-motion";
import { MapPin, FlaskConical, Cpu, ShieldCheck, Sparkles, Handshake } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { MoleculeBackground } from "@/components/MoleculeBackground";

const icons = [
  <MapPin key="map" className="w-7 h-7" />,
  <FlaskConical key="flask" className="w-7 h-7" />,
  <Cpu key="cpu" className="w-7 h-7" />,
  <ShieldCheck key="shield" className="w-7 h-7" />,
  <Sparkles key="sparkles" className="w-7 h-7" />,
  <Handshake key="handshake" className="w-7 h-7" />,
];

const colors = [
  { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", hover: "hover:border-amber-300 hover:shadow-amber-100" },
  { text: "text-teal-600", bg: "bg-teal-50", border: "border-teal-200", hover: "hover:border-teal-300 hover:shadow-teal-100" },
  { text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", hover: "hover:border-blue-300 hover:shadow-blue-100" },
  { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", hover: "hover:border-emerald-300 hover:shadow-emerald-100" },
  { text: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200", hover: "hover:border-violet-300 hover:shadow-violet-100" },
  { text: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200", hover: "hover:border-rose-300 hover:shadow-rose-100" },
];

export function FeaturesSection() {
  const { t } = useLanguage();

  return (
    <section id="why-cynova" className="py-28 relative overflow-hidden bg-background scroll-mt-20">
      {/* Molecule network background */}
      <div className="absolute inset-0 text-primary molecule-bg pointer-events-none">
        <MoleculeBackground />
      </div>
      {/* Subtle radial tint */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,oklch(0.50_0.16_192/5%),transparent)] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs uppercase tracking-widest text-primary font-semibold mb-4"
          >
            {t.features.sectionLabel}
          </motion.p>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-foreground"
          >
            {t.features.sectionTitle}
          </motion.h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {t.features.items.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className={`group relative p-8 rounded-2xl bg-card border ${colors[index].border} ${colors[index].hover} shadow-sm hover:shadow-lg transition-all duration-400 hover:-translate-y-2 overflow-hidden`}
            >
              {/* Hover gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${colors[index].bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className={`w-14 h-14 rounded-2xl ${colors[index].bg} border ${colors[index].border} flex items-center justify-center mb-5 relative z-10 ${colors[index].text} transition-transform duration-300 group-hover:scale-110`}>
                {icons[index]}
              </div>
              <h4 className="text-lg font-bold text-foreground mb-3 relative z-10">{feature.title}</h4>
              <p className="text-base text-muted-foreground leading-relaxed relative z-10">{feature.description}</p>

              {/* Corner accent */}
              <div className={`absolute top-0 right-0 w-16 h-16 ${colors[index].bg} rounded-bl-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
