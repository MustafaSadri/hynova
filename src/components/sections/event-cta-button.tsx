"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

// Always-visible fallback to /rsvp — the homepage popup can be missed,
// dismissed, or simply not shown again (it remembers dismissal), so this
// stays on screen everywhere as the one path that's never unreachable.
// Hidden only on the registration page itself and the admin dashboard.
export function EventCtaButton() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const t = translations[language].eventPopup;

  if (pathname === "/rsvp" || pathname.startsWith("/admin")) return null;

  return (
    <Link
      href="/rsvp"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 px-5 py-3 text-sm font-medium text-white shadow-[0_8px_24px_rgba(13,148,136,0.35)] transition hover:from-teal-400 hover:to-cyan-400"
    >
      <Sparkles className="size-4" />
      {t.floatingCta}
    </Link>
  );
}
