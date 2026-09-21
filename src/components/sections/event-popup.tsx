"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

const DISMISSED_KEY = "cynapept-event-popup-dismissed";
const SHOW_DELAY_MS = 1500;

export function EventPopup() {
  const { language } = useLanguage();
  const t = translations[language].eventPopup;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(DISMISSED_KEY) === "1";
    } catch {
      // Private browsing / storage blocked — just show it, no harm done.
    }
    if (dismissed) return;

    const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // Nothing to fall back to — worst case it shows again next visit.
    }
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      onClick={dismiss}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.15)] sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label={t.close}
          className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
        >
          <X className="size-4" />
        </button>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-medium tracking-wide text-teal-700">
          <Sparkles className="size-3.5" />
          {t.eyebrow}
        </span>

        <h2 className="mt-4 text-2xl font-light tracking-tight text-neutral-900">
          {t.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-500">
          {t.body}
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Link
            href="/rsvp"
            onClick={dismiss}
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-12 flex-1 rounded-full border-0 bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-[0_8px_20px_rgba(13,148,136,0.25)] hover:from-teal-400 hover:to-cyan-400",
            )}
          >
            {t.cta}
          </Link>
          <button
            type="button"
            onClick={dismiss}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-12 rounded-full border-neutral-200 text-neutral-600 hover:bg-neutral-50",
            )}
          >
            {t.dismiss}
          </button>
        </div>
      </div>
    </div>
  );
}
