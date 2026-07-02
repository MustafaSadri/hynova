"use client";

import { motion } from "framer-motion";
import { Mail, MessageCircle, MapPin, Send } from "lucide-react";

function InstagramIcon({ className = "w-4.5 h-4.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.1" fill="currentColor" strokeWidth="3" />
    </svg>
  );
}
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useLanguage } from "@/context/LanguageContext";

export function ContactSection() {
  const { t } = useLanguage();

  return (
    <section id="contact" className="py-28 relative overflow-hidden bg-background scroll-mt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_30%_50%,oklch(0.72_0.17_192/6%),transparent)] -z-10 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Left — info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-4">{t.contact.sectionLabel}</p>
            <h3 className="text-4xl md:text-5xl font-bold mb-2 text-foreground leading-tight">
              {t.contact.title}
            </h3>
            <h4 className="text-3xl md:text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
              {t.contact.titleHighlight}
            </h4>
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed max-w-md">{t.contact.subtitle}</p>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary flex-shrink-0">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-0.5">{t.contact.emailLabel}</h4>
                  <a href="mailto:Enquiries@cynova.life" className="text-muted-foreground hover:text-primary transition-colors">
                    Enquiries@cynova.life
                  </a>
                </div>
              </div>

              {/* WhatsApp / Telegram */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-400/10 border border-emerald-400/25 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <MessageCircle className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-0.5">{t.contact.phoneLabel}</h4>
                  <a href="https://wa.me/971503702435" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors block">
                    {t.contact.phoneValue}
                  </a>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.contact.phoneHours}</p>
                </div>
              </div>

              {/* Instagram */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-rose-400/10 border border-rose-400/25 flex items-center justify-center text-rose-400 flex-shrink-0">
                  <InstagramIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-0.5">{t.contact.instagramLabel}</h4>
                  <a href="https://www.instagram.com/cynova.life" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    {t.contact.instagramValue}
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-amber-400/10 border border-amber-400/25 flex items-center justify-center text-amber-400 flex-shrink-0">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-0.5">{t.contact.addressLabel}</h4>
                  <p className="text-muted-foreground">{t.contact.addressValue}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="bg-card border border-border/60 shadow-xl shadow-primary/5 p-8 md:p-10 rounded-2xl">
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">{t.contact.firstName}</label>
                    <Input
                      placeholder={t.contact.firstNamePlaceholder}
                      className="bg-background border-border focus-visible:ring-primary h-11"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">{t.contact.lastName}</label>
                    <Input
                      placeholder={t.contact.lastNamePlaceholder}
                      className="bg-background border-border focus-visible:ring-primary h-11"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">{t.contact.email}</label>
                  <Input
                    type="email"
                    placeholder={t.contact.emailPlaceholder}
                    className="bg-background border-border focus-visible:ring-primary h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">{t.contact.company}</label>
                  <Input
                    placeholder={t.contact.companyPlaceholder}
                    className="bg-background border-border focus-visible:ring-primary h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">{t.contact.message}</label>
                  <Textarea
                    placeholder={t.contact.messagePlaceholder}
                    className="bg-background border-border focus-visible:ring-primary min-h-[110px] resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold shadow-[0_4px_16px_oklch(0.50_0.16_192/25%)]"
                >
                  {t.contact.submitBtn}
                  <Send className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
