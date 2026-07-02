"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import translations, { Language } from "@/lib/translations";

type TranslationShape = typeof translations["en"];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationShape;
  hasChosen: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [hasChosen, setHasChosen] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("cynova-lang") as Language | null;
    setTimeout(() => {
      if (stored === "en" || stored === "ru") {
        setLanguageState(stored);
        setHasChosen(true);
      } else {
        setHasChosen(false);
      }
    }, 0);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setHasChosen(true);
    localStorage.setItem("cynova-lang", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] as TranslationShape, hasChosen }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
