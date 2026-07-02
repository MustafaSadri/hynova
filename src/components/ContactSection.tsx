"use client";

import { motion } from "framer-motion";
import { Mail, MessageCircle, MapPin } from "lucide-react";

function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.1" fill="currentColor" strokeWidth="3" />
    </svg>
  );
}

import { useLanguage } from "@/context/LanguageContext";

export function ContactSection() {
  const { t } = useLanguage();

  const contactItems = [
    {
      icon: <Mail className="w-5 h-5" />,
      title: t.contact.emailLabel,
      value: "support@cynova.life",
      href: "mailto:support@cynova.life",
      color: "text-primary border-primary/25 bg-primary/10",
      hoverGlow: "shadow-primary/5 hover:border-primary/45",
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      title: t.contact.phoneLabel,
      value: t.contact.phoneValue,
      subtitle: t.contact.phoneHours,
      href: "https://wa.me/971503702435",
      color: "text-emerald-500 border-emerald-500/25 bg-emerald-500/10",
      hoverGlow: "shadow-emerald-500/5 hover:border-emerald-500/45",
    },
    {
      icon: <InstagramIcon className="w-5 h-5" />,
      title: t.contact.instagramLabel,
      value: t.contact.instagramValue,
      href: "https://www.instagram.com/cynova.life",
      color: "text-rose-500 border-rose-500/25 bg-rose-500/10",
      hoverGlow: "shadow-rose-500/5 hover:border-rose-500/45",
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: t.contact.addressLabel,
      value: t.contact.addressValue,
      color: "text-amber-500 border-amber-500/25 bg-amber-500/10",
      hoverGlow: "shadow-amber-500/5 hover:border-amber-500/45",
    },
  ];

  return (
    <section id="contact" className="py-28 relative overflow-hidden bg-background scroll-mt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,oklch(0.72_0.17_192/6%),transparent)] -z-10 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-5xl mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs uppercase tracking-widest text-primary font-semibold mb-4"
          >
            {t.contact.sectionLabel}
          </motion.p>
          <motion.h3
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-3 text-foreground leading-tight"
          >
            {t.contact.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">{t.contact.titleHighlight}</span>
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-base max-w-xl mx-auto"
          >
            {t.contact.subtitle}
          </motion.p>
        </div>

        {/* Centered cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {contactItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className={`bg-card border border-border/50 p-6 rounded-2xl flex gap-5 transition-all duration-300 shadow-sm hover:shadow-md ${item.hoverGlow}`}
            >
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${item.color}`}>
                {item.icon}
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider text-muted-foreground/80 mb-1">{item.title}</h4>
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-lg font-bold text-foreground hover:text-primary transition-colors leading-tight break-all"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-lg font-bold text-foreground leading-tight">{item.value}</p>
                )}
                {item.subtitle && (
                  <p className="text-xs text-muted-foreground mt-1">{item.subtitle}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
