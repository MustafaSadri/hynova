"use client";

import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { cn, scrollToId } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Nebula from "@/components/ui/nebula";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

export function Hero() {
  const { language } = useLanguage();
  const t = translations[language].hero;

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#0a0f1c]">
      <Nebula speed={1.1} color1="#7dfdf0" color2="#125a5f" color3="#050a14" />

      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center gap-10 px-6">
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/logo/cynapept-white.svg"
            alt="Cynapept"
            width={280}
            height={60}
            priority
            className="h-12 w-auto md:h-16"
          />
          <p className="text-xs uppercase tracking-[0.3em] text-white/50 sm:text-sm">
            {t.tagline}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="#portfolio"
            onClick={scrollToId("portfolio")}
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-11 rounded-full border-0 bg-gradient-to-r from-teal-500 to-cyan-500 px-6 text-white shadow-[0_0_24px_rgba(45,212,191,0.25)] hover:from-teal-400 hover:to-cyan-400",
            )}
          >
            {t.exploreButton}
          </Link>
          <Link
            href="/verify"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11 rounded-full border-white/[0.2] bg-transparent px-6 text-white/80 hover:border-white/40 hover:bg-white/[0.05] hover:text-white",
            )}
          >
            <ShieldCheck className="size-4" />
            {t.verifyButton}
          </Link>
        </div>
      </div>
    </section>
  );
}
