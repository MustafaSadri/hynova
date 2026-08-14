"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu as MenuIcon, X } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";
import { cn, scrollToId } from "@/lib/utils";
import { LanguageSelectorDropdown } from "@/components/ui/language-selector-dropdown";
import { Menu, type IMenu } from "@/components/ui/nav-menu";

export function Navbar() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const t = translations[language].nav;
  const isHome = pathname === "/";

  // Every page now sits on the same light pastel gradient, so the header is
  // transparent at the top and picks up a solid blurred bar once scrolled —
  // no more light/dark text swap since the background is never dark.
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 80);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Below `sm` the inline Menu is hidden entirely, so this toggle is the
  // only way to reach nav links on mobile — without it the whole menu was
  // unreachable on phones.
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const transparent = !scrolled && !mobileOpen;

  const menuList: IMenu[] = [
    { id: 1, title: t.home, url: "/" },
    {
      id: 2,
      title: t.portfolio,
      url: isHome ? "#portfolio" : "/#portfolio",
      onClick: isHome ? scrollToId("portfolio") : undefined,
    },
    { id: 3, title: t.quality, url: "/quality-compliance" },
    { id: 4, title: t.about, url: "/about" },
    {
      id: 5,
      title: t.contact,
      url: isHome ? "#contact" : "/#contact",
      onClick: isHome ? scrollToId("contact") : undefined,
    },
  ];

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        transparent
          ? "bg-transparent"
          : "border-b border-neutral-200/60 bg-white/80 backdrop-blur-md",
      )}
    >
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

        <div className="hidden sm:block">
          <Menu list={menuList} variant="dark" />
        </div>

        <div className="flex items-center gap-2">
          <LanguageSelectorDropdown />

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white/70 text-neutral-700 backdrop-blur-sm transition-colors hover:bg-white sm:hidden"
          >
            {mobileOpen ? (
              <X className="size-4.5" />
            ) : (
              <MenuIcon className="size-4.5" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          id="mobile-nav-panel"
          className="border-t border-neutral-200/60 bg-white/95 px-6 py-3 shadow-lg backdrop-blur-xl sm:hidden"
        >
          <nav className="mx-auto flex max-w-6xl flex-col">
            {menuList.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                onClick={(e) => {
                  item.onClick?.(e);
                  setMobileOpen(false);
                }}
                className="rounded-lg px-3 py-3 text-base font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
