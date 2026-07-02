"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Shield } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const navLinks = [
  { label: { en: "About", ru: "О нас" }, id: "about" },
  { label: { en: "Portfolio", ru: "Портфолио" }, id: "portfolio" },
  { label: { en: "Manufacturing", ru: "Производство" }, id: "manufacturing" },
  { label: { en: "Why Us", ru: "Почему мы" }, id: "why-cynova" },
  { label: { en: "Contact", ru: "Контакт" }, id: "contact" },
];

export function Navbar() {
  const { language, setLanguage } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleNav = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", `#${id}`);
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group/logo">
          <div className="w-9 h-9 relative transition-transform duration-300 group-hover/logo:scale-105">
            <Image
              src="/cynova-logo.png"
              alt="CYNOVA"
              fill
              className="object-contain mix-blend-multiply"
              sizes="36px"
              priority
            />
          </div>
          <span className="text-lg font-bold tracking-widest text-foreground transition-colors group-hover/logo:text-primary">CYNOVA<span className="text-primary">.</span>LIFE</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleNav(e, link.id)}
              className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-white/5"
            >
              {link.label[language]}
            </a>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <div className="flex items-center gap-0.5 p-0.5 rounded-full bg-card border border-border/50">
            <button
              onClick={() => setLanguage("en")}
              className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all ${
                language === "en"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("ru")}
              className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all ${
                language === "ru"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              RU
            </button>
          </div>

          {/* Verify link — desktop */}
          <Link
            href="/verify"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
          >
            <Shield className="w-3 h-3" />
            {language === "en" ? "Verify" : "Проверить"}
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1.5 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-white/95 backdrop-blur-xl">
          <nav className="flex flex-col px-4 py-4 gap-1">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleNav(e, link.id)}
                className="px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
              >
                {link.label[language]}
              </a>
            ))}
            <Link
              href="/verify"
              className="mt-2 flex items-center gap-2 px-4 py-3 text-sm font-semibold text-primary rounded-lg border border-primary/30 hover:bg-primary/10 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <Shield className="w-4 h-4" />
              {language === "en" ? "Verify Product" : "Проверить продукт"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
