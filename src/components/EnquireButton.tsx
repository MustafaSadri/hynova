"use client";

import { useState, type ReactNode } from "react";
import { MessageCircle, Send } from "lucide-react";

const PREFILLED_MESSAGE =
  "Hi! I'm interested in CYNOVA's metabolic health products and have a few questions.";

type Channel = {
  label: string;
  href: string;
  icon: ReactNode;
  className: string;
};

export function EnquireButton() {
  const [open, setOpen] = useState(false);

  const telegramUsername = process.env.NEXT_PUBLIC_TELEGRAM_USERNAME;
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const encodedMessage = encodeURIComponent(PREFILLED_MESSAGE);

  const channels: Channel[] = [];
  if (telegramUsername) {
    channels.push({
      label: "Telegram",
      href: `https://t.me/${telegramUsername}?text=${encodedMessage}`,
      icon: <Send className="size-4" />,
      className: "bg-[#229ED9]/10 text-[#1b8fc4] hover:bg-[#229ED9]/20",
    });
  }
  if (whatsappNumber) {
    channels.push({
      label: "WhatsApp",
      href: `https://wa.me/${whatsappNumber}?text=${encodedMessage}`,
      icon: <MessageCircle className="size-4" />,
      className: "bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20",
    });
  }

  if (channels.length === 0) return null;

  // Single channel: one direct, inviting pill button — no extra click needed.
  if (channels.length === 1) {
    const channel = channels[0];
    return (
      <div className="fixed bottom-6 right-24 z-50">
        <span className="absolute inset-0 rounded-full bg-primary/35 animate-ping [animation-duration:2.5s]" />
        <a
          href={channel.href}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center gap-2 rounded-full bg-primary py-3.5 pl-4 pr-5 text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105"
        >
          {channel.icon}
          <span className="text-sm font-semibold whitespace-nowrap">Enquire Now</span>
        </a>
      </div>
    );
  }

  // Multiple channels: trigger + choice popover.
  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close enquiry options" : "Enquire Now"}
        className="fixed bottom-6 right-24 z-50 flex items-center gap-2 rounded-full bg-primary py-3.5 pl-4 pr-5 text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105"
      >
        <MessageCircle className="size-5 shrink-0" />
        <span className="text-sm font-semibold whitespace-nowrap">Enquire Now</span>
      </button>

      {open && (
        <div className="fixed bottom-24 right-24 z-50 flex w-56 flex-col gap-2 rounded-2xl border border-border/50 bg-card p-3 shadow-2xl">
          <p className="px-1 pb-1 text-xs font-semibold text-muted-foreground">
            Enquire Now via
          </p>
          {channels.map((channel) => (
            <a
              key={channel.label}
              href={channel.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${channel.className}`}
            >
              {channel.icon}
              {channel.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
