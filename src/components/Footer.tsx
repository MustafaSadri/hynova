"use client";

import { MessageCircle, Mail } from "lucide-react";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.1" fill="currentColor" strokeWidth="3" />
    </svg>
  );
}
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-card/30 border-t border-border/40 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 relative">
                <Image
                  src="/cynova-logo.png"
                  alt="CYNOVA"
                  fill
                  className="object-contain mix-blend-multiply"
                  sizes="32px"
                />
              </div>
              <span className="text-lg font-bold tracking-widest text-foreground">CYNOVA<span className="text-primary">.</span>LIFE</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{t.footer.tagline}</p>

            {/* Social links */}
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/cynova.life"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-card border border-border/60 flex items-center justify-center text-muted-foreground hover:text-rose-400 hover:border-rose-400/40 transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/971503702435"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-card border border-border/60 flex items-center justify-center text-muted-foreground hover:text-emerald-400 hover:border-emerald-400/40 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="mailto:Enquiries@cynova.life"
                className="w-9 h-9 rounded-full bg-card border border-border/60 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-foreground font-semibold mb-5 text-sm tracking-wide">{t.footer.quickLinks}</h4>
            <ul className="space-y-3">
              {t.footer.links.map((link, i) => (
                <li key={i}>
                  <a href="#" className="text-muted-foreground text-sm hover:text-primary transition-colors">{link}</a>
                </li>
              ))}
              <li>
                <Link
                  href="/verify"
                  className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse inline-block" />
                  {t.footer.verifyProduct}
                </Link>
              </li>
            </ul>
          </div>

          {/* Portfolio */}
          <div>
            <h4 className="text-foreground font-semibold mb-5 text-sm tracking-wide">{t.footer.portfolioLabel}</h4>
            <ul className="space-y-3">
              {["Retatrutide Injection", "Retatrutide Powder", "Tirzepatide Injection", "Tirzepatide Powder", "Orforglipron Tablets"].map((name) => (
                <li key={name}>
                  <a href="#portfolio" className="text-muted-foreground text-sm hover:text-primary transition-colors">{name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal + Disclaimer */}
          <div>
            <h4 className="text-foreground font-semibold mb-5 text-sm tracking-wide">{t.footer.legal}</h4>
            <ul className="space-y-3 mb-6">
              {t.footer.legalLinks.map((link, i) => (
                <li key={i}>
                  <a href="#" className="text-muted-foreground text-sm hover:text-primary transition-colors">{link}</a>
                </li>
              ))}
            </ul>
            <div className="p-4 bg-primary/5 border border-primary/15 rounded-xl">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-semibold text-primary">{t.footer.disclaimerLabel} </span>
                {t.footer.disclaimer}
              </p>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} CYNOVA.LIFE. {t.footer.allRights}
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              {t.footer.systemsOk}
            </span>
            <a href="mailto:Enquiries@cynova.life" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Enquiries@cynova.life
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
