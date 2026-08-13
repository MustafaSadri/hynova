import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MinimalFooter } from "@/components/ui/minimal-footer";
import { Navbar } from "@/components/ui/navbar";
import { LanguageProvider } from "@/lib/language-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cynapept",
  description: "Cynapept — Precision Peptide Therapeutics",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <Navbar />
          {children}
          <MinimalFooter />
        </LanguageProvider>
      </body>
    </html>
  );
}
