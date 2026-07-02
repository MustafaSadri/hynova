"use client";

import { ReactNode } from "react";
import { LanguageProvider } from "@/context/LanguageContext";
import { LanguagePopup } from "@/components/LanguagePopup";

export function ClientWrapper({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <LanguagePopup />
      {children}
    </LanguageProvider>
  );
}
