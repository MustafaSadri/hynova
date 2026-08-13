"use client";

import { useLanguage, type Language } from "@/lib/language-context";
import { cn } from "@/lib/utils";

const OPTIONS: { code: Language; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
];

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-0.5 rounded-full border border-neutral-200 bg-neutral-50 p-0.5 text-xs font-medium">
      {OPTIONS.map((option) => (
        <button
          key={option.code}
          type="button"
          onClick={() => setLanguage(option.code)}
          aria-pressed={language === option.code}
          className={cn(
            "rounded-full px-2.5 py-1 transition-colors",
            language === option.code
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-500 hover:text-neutral-700",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
