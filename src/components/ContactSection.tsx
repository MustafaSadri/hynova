"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageCircle, MapPin, Send, Loader2 } from "lucide-react";

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

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error" | "validation-error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.email || !formData.message) {
      setStatus("validation-error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus("validation-error");
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          company: "",
          message: "",
        });
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error("Contact form error:", err);
      setStatus("error");
    }
  };

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
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">{t.contact.firstName}</label>
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder={t.contact.firstNamePlaceholder}
                      className="bg-background border-border focus-visible:ring-primary h-11"
                      disabled={status === "submitting"}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">{t.contact.lastName}</label>
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder={t.contact.lastNamePlaceholder}
                      className="bg-background border-border focus-visible:ring-primary h-11"
                      disabled={status === "submitting"}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">{t.contact.email}</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t.contact.emailPlaceholder}
                    className="bg-background border-border focus-visible:ring-primary h-11"
                    disabled={status === "submitting"}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">{t.contact.company}</label>
                  <Input
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder={t.contact.companyPlaceholder}
                    className="bg-background border-border focus-visible:ring-primary h-11"
                    disabled={status === "submitting"}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">{t.contact.message}</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t.contact.messagePlaceholder}
                    className="bg-background border-border focus-visible:ring-primary min-h-[110px] resize-none"
                    disabled={status === "submitting"}
                    required
                  />
                </div>

                {status === "validation-error" && (
                  <div className="p-3 text-xs bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-xl font-medium">
                    {t.contact.validationError}
                  </div>
                )}

                {status === "success" && (
                  <div className="p-3 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-xl font-medium">
                    {t.contact.submitSuccess}
                  </div>
                )}

                {status === "error" && (
                  <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-xl font-medium">
                    {t.contact.submitError}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold shadow-[0_4px_16px_oklch(0.50_0.16_192/25%)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {status === "submitting" ? (
                    <>
                      {t.contact.submitting}
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      {t.contact.submitBtn}
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
