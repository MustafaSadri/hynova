"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useLanguage } from "@/context/LanguageContext";

export function ContactSection() {
  const { t } = useLanguage();

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 -z-10"></div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-sm uppercase tracking-widest text-primary font-semibold mb-4">{t.contact.sectionLabel}</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
              {t.contact.title} <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">{t.contact.titleHighlight}</span>
            </h3>
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed max-w-md">{t.contact.subtitle}</p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-primary flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{t.contact.emailLabel}</h4>
                  <p className="text-muted-foreground">mustafassadriwala548@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-primary flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{t.contact.phoneLabel}</h4>
                  <p className="text-muted-foreground">{t.contact.phoneValue}</p>
                  <p className="text-muted-foreground">{t.contact.phoneHours}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-primary flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{t.contact.addressLabel}</h4>
                  <p className="text-muted-foreground">{t.contact.addressValue}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-card/50 backdrop-blur-xl border border-border/50 p-8 md:p-10 rounded-3xl shadow-2xl relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-[2rem] blur-xl -z-10 opacity-50"></div>

            <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{t.contact.firstName}</label>
                  <Input placeholder={t.contact.firstNamePlaceholder} className="bg-background/50 border-border/50 focus-visible:ring-primary h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{t.contact.lastName}</label>
                  <Input placeholder={t.contact.lastNamePlaceholder} className="bg-background/50 border-border/50 focus-visible:ring-primary h-12" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">{t.contact.email}</label>
                <Input type="email" placeholder={t.contact.emailPlaceholder} className="bg-background/50 border-border/50 focus-visible:ring-primary h-12" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">{t.contact.company}</label>
                <Input placeholder={t.contact.companyPlaceholder} className="bg-background/50 border-border/50 focus-visible:ring-primary h-12" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">{t.contact.message}</label>
                <Textarea placeholder={t.contact.messagePlaceholder} className="bg-background/50 border-border/50 focus-visible:ring-primary min-h-[120px] resize-none" />
              </div>

              <Button type="submit" className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 text-base shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                {t.contact.submitBtn}
                <Send className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
