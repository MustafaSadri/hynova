"use client";

import { useState, type ReactNode } from "react";
import { MessageCircle, Send } from "lucide-react";

const PREFILLED_MESSAGE =
  "Hi! I'm interested in CYNOVA's metabolic health products and have a few questions.";

const GLOW_STYLE = `
@keyframes cynova-enquire-glow {
  0%, 100% { box-shadow: 0 0 14px 2px rgba(34,158,217,0.45), 0 6px 18px rgba(0,0,0,0.18); }
  50% { box-shadow: 0 0 28px 8px rgba(34,158,217,0.8), 0 6px 18px rgba(0,0,0,0.18); }
}
.cynova-enquire-glow { animation: cynova-enquire-glow 2.6s ease-in-out infinite; }
`;

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

  // Single channel: a small glowing indicator icon — one tap, straight to Telegram.
  if (channels.length === 1) {
    const channel = channels[0];
    return (
      <div className="group fixed bottom-6 right-24 z-50">
        <style dangerouslySetInnerHTML={{ __html: GLOW_STYLE }} />
        <span className="pointer-events-none absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1 text-xs font-medium text-background opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100">
          Message us on {channel.label}
        </span>
        <a
          href={channel.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Message us on ${channel.label}`}
          className="cynova-enquire-glow relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#2AABEE] to-[#229ED9] text-white transition-transform duration-300 hover:-translate-y-0.5 hover:scale-110"
        >
          {channel.icon}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-card bg-white" />
          </span>
        </a>
      </div>
    );
  }

  // Multiple channels: compact trigger + choice popover.
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOW_STYLE }} />
      <div className="group fixed bottom-6 right-24 z-50">
        <span className="pointer-events-none absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1 text-xs font-medium text-background opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100">
          {open ? "Close" : "Enquire Now"}
        </span>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close enquiry options" : "Enquire Now"}
          className="cynova-enquire-glow relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#2AABEE] to-[#229ED9] text-white transition-transform duration-300 hover:-translate-y-0.5 hover:scale-110"
        >
          <MessageCircle className="size-6" />
        </button>
      </div>

      {open && (
        <div className="fixed bottom-24 right-24 z-50 flex w-56 flex-col gap-2 rounded-2xl border border-primary/15 bg-card/95 p-3 shadow-2xl shadow-primary/20 backdrop-blur-xl">
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
