"use client";

import { motion } from "framer-motion";
import { Scale, Target, Droplet, Heart, Activity } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { MoleculeBackground } from "@/components/MoleculeBackground";

const icons = [
  <Activity key="activity" className="w-6 h-6" />,
  <Scale key="scale" className="w-6 h-6" />,
  <Target key="target" className="w-6 h-6" />,
  <Droplet key="droplet" className="w-6 h-6" />,
  <Heart key="heart" className="w-6 h-6" />,
];

const colors = [
  { text: "text-teal-600", bg: "bg-teal-50", border: "border-teal-100", hover: "hover:border-teal-300 hover:shadow-teal-100/50" },
  { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", hover: "hover:border-amber-300 hover:shadow-amber-100/50" },
  { text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", hover: "hover:border-blue-300 hover:shadow-blue-100/50" },
  { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", hover: "hover:border-emerald-300 hover:shadow-emerald-100/50" },
  { text: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100", hover: "hover:border-rose-300 hover:shadow-rose-100/50" },
];

export function TherapeuticFocus() {
  const { t, language } = useLanguage();
  const tf = t.therapeuticFocus;

  return (
    <section id="therapeutic-focus" className="py-28 relative overflow-hidden bg-background scroll-mt-20 border-t border-border/30">
      {/* Background elements */}
      <div className="absolute inset-0 text-primary molecule-bg-slow pointer-events-none">
        <MoleculeBackground />
      </div>
      <div className="absolute top-1/2 right-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs uppercase tracking-widest text-primary font-semibold mb-4"
          >
            {tf.sectionLabel}
          </motion.p>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={language === "ru" ? "text-xl md:text-2xl font-bold text-foreground mb-6" : "text-3xl md:text-5xl font-bold text-foreground mb-6"}
          >
            {tf.title}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-base md:text-lg"
          >
            {tf.subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {tf.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group relative p-6 rounded-2xl bg-card border ${colors[index].border} ${colors[index].hover} shadow-sm hover:shadow-lg transition-all duration-400 hover:-translate-y-1.5 overflow-hidden`}
            >
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${colors[index].bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className={`w-12 h-12 rounded-xl ${colors[index].bg} border ${colors[index].border} flex items-center justify-center mb-5 relative z-10 ${colors[index].text} transition-transform duration-300 group-hover:scale-110`}>
                {icons[index]}
              </div>
              <h4 className="text-base font-bold text-foreground mb-2.5 relative z-10">{item.title}</h4>
              <p className="text-[15px] text-muted-foreground leading-relaxed relative z-10">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
