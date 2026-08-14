"use client";

import { GlobeIcon, MailIcon, MessageCircleIcon } from "lucide-react";
import Image from "next/image";
import { scrollToId } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

// Only real same-page anchors (e.g. "#contact") get the scroll fix;
// plain "#" placeholders are left as-is until those pages exist.
function anchorClick(href: string) {
  return href.startsWith("#") && href.length > 1
    ? scrollToId(href.slice(1))
    : undefined;
}

export function MinimalFooter() {
  const { language } = useLanguage();
  const t = translations[language].footer;
  const year = new Date().getFullYear();

  const company = [
    { title: t.aboutUs, href: "/about" },
    { title: t.qualityCompliance, href: "/quality-compliance" },
  ];

  const resources = [
    { title: t.verifyProduct, href: "/verify" },
    { title: t.helpCenter, href: "#" },
    { title: t.contactSupport, href: "#contact" },
  ];

  const contactLinks = [
    { icon: <MailIcon className="size-4" />, link: "mailto:support@cynapept.com" },
    { icon: <MessageCircleIcon className="size-4" />, link: "#contact" },
  ];

  return (
    <footer className="relative">
      <div className="bg-[radial-gradient(35%_80%_at_30%_0%,--theme(--color-foreground/.06),transparent)] mx-auto max-w-6xl px-6">
        <div className="bg-border absolute inset-x-0 h-px w-full" />
        <div className="grid grid-cols-6 gap-6 py-10">
          <div className="col-span-6 flex flex-col gap-5 md:col-span-4">
            <a href="#" className="w-max">
              <Image
                src="/logo/cynapept-color.svg"
                alt="Cynapept"
                width={160}
                height={34}
                className="h-7 w-auto"
              />
            </a>
            <p className="text-muted-foreground max-w-sm font-mono text-sm text-balance">
              {t.tagline}
            </p>
            <div className="flex gap-2">
              {contactLinks.map((item, i) => (
                <a
                  key={i}
                  className="hover:bg-accent rounded-md border p-1.5"
                  href={item.link}
                  onClick={anchorClick(item.link)}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
          <div className="col-span-3 w-full md:col-span-1">
            <span className="text-muted-foreground mb-1 text-xs">
              {t.resourcesHeading}
            </span>
            <div className="flex flex-col gap-1">
              {resources.map(({ href, title }, i) => (
                <a
                  key={i}
                  className="w-max py-1 text-sm duration-200 hover:underline"
                  href={href}
                  onClick={anchorClick(href)}
                >
                  {title}
                </a>
              ))}
            </div>
          </div>
          <div className="col-span-3 w-full md:col-span-1">
            <span className="text-muted-foreground mb-1 text-xs">
              {t.companyHeading}
            </span>
            <div className="flex flex-col gap-1">
              {company.map(({ href, title }, i) => (
                <a
                  key={i}
                  className="w-max py-1 text-sm duration-200 hover:underline"
                  href={href}
                  onClick={anchorClick(href)}
                >
                  {title}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-border absolute inset-x-0 h-px w-full" />
        <div className="flex w-full flex-col justify-between gap-2 pt-2 pb-5">
          <p className="text-muted-foreground text-center font-thin">
            © Cynapept. {t.rightsReserved} {year}
          </p>
        </div>
      </div>
    </footer>
  );
}
