"use client";

import { ReactNode } from "react";
import { LanguageProvider } from "@/context/LanguageContext";
import { LanguagePopup } from "@/components/LanguagePopup";
import { LanguageToggle } from "@/components/LanguageToggle";

export function ClientWrapper({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <LanguagePopup />
      <LanguageToggle />
      {children}
    </LanguageProvider>
  );
}
