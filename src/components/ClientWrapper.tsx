"use client";

import { ReactNode } from "react";
import { LanguageProvider } from "@/context/LanguageContext";
import { LanguagePopup } from "@/components/LanguagePopup";
import { ChatWidget } from "@/components/ChatWidget";
import { EnquireButton } from "@/components/EnquireButton";

export function ClientWrapper({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <LanguagePopup />
      {children}
      <EnquireButton />
      <ChatWidget />
    </LanguageProvider>
  );
}
