"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Language = "en" | "ru";

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (lang: Language) => void;
}>({
  language: "en",
  setLanguage: () => {},
});

const STORAGE_KEY = "cynapept-language";

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Always starts "en" on both server and first client render, then syncs
  // from localStorage after mount — avoids a hydration mismatch.
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    // Genuine external-system sync: localStorage isn't reachable during SSR
    // render, so hydrating from it can only happen after mount.
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "ru") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLanguageState(stored);
    }
  }, []);

  function setLanguage(lang: Language) {
    setLanguageState(lang);
    window.localStorage.setItem(STORAGE_KEY, lang);
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
