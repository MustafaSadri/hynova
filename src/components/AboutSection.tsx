"use client";

import { motion } from "framer-motion";
import { Globe, ShieldCheck, Cpu, FlaskConical } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { MoleculeBackground } from "@/components/MoleculeBackground";

const icons = [
  <Globe key="globe" className="w-6 h-6" />,
  <FlaskConical key="flask" className="w-6 h-6" />,
  <Cpu key="cpu" className="w-6 h-6" />,
  <ShieldCheck key="shield" className="w-6 h-6" />,
];

const statColors = [
  { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
  { text: "text-teal-600", bg: "bg-teal-50", border: "border-teal-200" },
  { text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
];

export function AboutSection() {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-28 px-4 relative overflow-hidden bg-background scroll-mt-20">
      {/* Molecule network background */}
      <div className="absolute inset-0 text-primary molecule-bg-slow pointer-events-none">
        <MoleculeBackground />
      </div>

      {/* Glow orb */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-0 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-4">{t.about.sectionLabel}</p>
            <h3 className="text-4xl md:text-5xl font-bold mb-4 text-foreground leading-tight">
              {t.about.title}
            </h3>
            <h4 className="text-2xl md:text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
              {t.about.titleHighlight}
            </h4>
            <p className="text-muted-foreground text-lg mb-5 leading-relaxed">{t.about.p1}</p>
            <p className="text-muted-foreground text-lg leading-relaxed">{t.about.p2}</p>

            {/* Three-flag row */}
            <div className="mt-8 flex flex-wrap gap-3">
              {[
                { flag: "🇦🇪", label: "UAE Headquartered" },
                { flag: "🇨🇭", label: "Swiss Standards" },
                { flag: "🇺🇸", label: "US Technology" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 px-3 py-2 rounded-full border border-border/50 bg-card/50 text-sm text-muted-foreground">
                  <span className="text-base">{item.flag}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-5">
            {t.about.stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                className={`relative bg-card border ${statColors[index].border} p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group overflow-hidden`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${statColors[index].bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className={`w-11 h-11 rounded-xl ${statColors[index].bg} border ${statColors[index].border} flex items-center justify-center ${statColors[index].text} mb-4 relative z-10`}>
                  {icons[index]}
                </div>
                <div className={`text-3xl font-bold mb-1 ${statColors[index].text} relative z-10`}>{stat.value}</div>
                <div className="text-xs text-muted-foreground font-medium leading-tight relative z-10">{stat.label}</div>
              </motion.div>
            ))}
          </div>

        </div>

        {/* Divider */}
        <div className="h-px bg-border/40 my-16 max-w-5xl mx-auto" />

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card border border-border/50 p-8 rounded-2xl relative overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
            <h4 className="text-xl font-bold text-foreground mb-4">{t.visionMission.visionTitle}</h4>
            <p className="text-muted-foreground leading-relaxed italic text-base">
              &ldquo;{t.visionMission.visionText}&rdquo;
            </p>
          </motion.div>

          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-card border border-border/50 p-8 rounded-2xl relative overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
            <h4 className="text-xl font-bold text-foreground mb-6">{t.visionMission.missionTitle}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {t.visionMission.missionItems.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-semibold text-foreground text-sm leading-tight mb-1">{item.title}</h5>
                    <p className="text-[11px] text-muted-foreground leading-tight">{item.desc}</p>
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
