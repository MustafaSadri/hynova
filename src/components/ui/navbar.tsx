"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";
import { scrollToId } from "@/lib/utils";
import { LanguageSelectorDropdown } from "@/components/ui/language-selector-dropdown";

export function Navbar() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const t = translations[language].nav;
  const isHome = pathname === "/";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-neutral-200/60 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="shrink-0">
          <Image
            src="/logo/cynapept-color.svg"
            alt="Cynapept"
            width={130}
            height={28}
            className="h-6 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-neutral-600 sm:flex">
          <Link href="/about" className="transition-colors hover:text-neutral-900">
            {t.about}
          </Link>
          <Link
            href="/quality-compliance"
            className="transition-colors hover:text-neutral-900"
          >
            {t.quality}
          </Link>
          {isHome ? (
            <a
              href="#contact"
              onClick={scrollToId("contact")}
              className="transition-colors hover:text-neutral-900"
            >
              {t.contact}
            </a>
          ) : (
            <Link href="/#contact" className="transition-colors hover:text-neutral-900">
              {t.contact}
            </Link>
          )}
        </nav>

        <LanguageSelectorDropdown />
      </div>
    </header>
  );
}
