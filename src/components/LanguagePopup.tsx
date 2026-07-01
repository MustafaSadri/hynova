"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export function LanguagePopup() {
  const { hasChosen, setLanguage, t } = useLanguage();

  return (
    <AnimatePresence>
      {!hasChosen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-card border border-border/50 rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center"
          >
            {/* Logo */}
            <div className="inline-flex items-center justify-center mb-6">
              <span className="flex h-2.5 w-2.5 rounded-full bg-primary mr-2.5 shadow-[0_0_10px_rgba(8,145,178,0.5)]" />
              <span className="text-lg font-bold tracking-widest text-foreground">CYNOVA.LIFE</span>
            </div>

            <h2 className="text-xl font-bold text-foreground mb-1">{t.popup.title}</h2>
            <p className="text-muted-foreground text-sm mb-8">{t.popup.subtitle}</p>

            <div className="flex gap-3">
              <button
                onClick={() => setLanguage("en")}
                className="flex-1 h-12 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all duration-200 font-semibold text-foreground flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="text-lg">🇬🇧</span>
                English
              </button>
              <button
                onClick={() => setLanguage("ru")}
                className="flex-1 h-12 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all duration-200 font-semibold text-foreground flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="text-lg">🇷🇺</span>
                Русский
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
