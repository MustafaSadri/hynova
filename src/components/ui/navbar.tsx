"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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

  // Only the home hero has a dark nebula background behind the fixed
  // header; once scrolled past it (or on any other page) the page
  // background is white, so the transparent/white-text look flips to a
  // solid, dark-text bar for legibility.
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 80);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = isHome && !scrolled;

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
            src={transparent ? "/logo/cynapept-white.svg" : "/logo/cynapept-color.svg"}
            alt="Cynapept"
            width={130}
            height={28}
            className="h-6 w-auto"
          />
        </Link>

        <div className="hidden sm:block">
          <Menu list={menuList} variant={transparent ? "light" : "dark"} />
        </div>

        <LanguageSelectorDropdown />
      </div>
    </header>
  );
}
