"use client";

import { useEffect, useRef, useState } from "react";
import { Stethoscope, X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const GLOW_STYLE = `
@keyframes cynapept-chat-glow {
  0%, 100% { box-shadow: 0 0 14px 2px oklch(0.50 0.16 192 / 45%), 0 6px 18px rgba(0,0,0,0.18); }
  50% { box-shadow: 0 0 28px 8px oklch(0.50 0.16 192 / 75%), 0 6px 18px rgba(0,0,0,0.18); }
}
.cynapept-chat-glow { animation: cynapept-chat-glow 2.6s ease-in-out infinite; }
`;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I'm the Cynapept Assistant. I can help you understand our metabolic health products — Retatrutide, Tirzepatide, and Orforglipron — and find what fits what you're looking for. What brings you here today?",
};

const QUICK_QUESTIONS = [
  "Why should I use these products?",
  "Which one fits my goals?",
  "What are the side effects on my body?",
  "What's the difference between them?",
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function sendMessage(overrideText?: string) {
    const trimmed = (overrideText ?? input).trim();
    if (!trimmed || isStreaming) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setInput("");
    setIsStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages([...nextMessages, { role: "assistant", content: assistantText }]);
      }
    } catch {
      setMessages([
        ...nextMessages,
        { role: "assistant", content: "Sorry, something went wrong. Please try again in a moment." },
      ]);
    } finally {
      setIsStreaming(false);
    }
  }

  const showQuickQuestions = messages.length === 1;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOW_STYLE }} />

      <div className="group fixed bottom-6 right-6 z-50">
        <span className="pointer-events-none absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1 text-xs font-medium text-background opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100">
          {open ? "Close chat" : "Chat with us"}
        </span>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close chat" : "Open chat"}
          className="cynapept-chat-glow relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary via-teal-500 to-cyan-400 text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5 hover:scale-110"
        >
          {open ? <X className="size-6" /> : <Stethoscope className="size-6" />}
          {!open && (
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-card bg-emerald-400" />
            </span>
          )}
        </button>
      </div>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[520px] w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-primary/15 bg-card/95 shadow-2xl shadow-primary/20 backdrop-blur-xl">
          <div className="flex items-center gap-3 border-b border-border/50 bg-gradient-to-r from-primary/15 via-secondary/40 to-transparent p-4">
            <div className="cynapept-chat-glow flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary via-teal-500 to-cyan-400 text-primary-foreground">
              <Stethoscope className="size-5" />
            </div>
            <div>
              <h3 className="flex items-center gap-1.5 font-bold text-foreground">
                Cynapept Assistant
                <Sparkles className="size-3.5 text-primary" />
              </h3>
              <p className="text-xs text-muted-foreground">Product Q&A · not a substitute for medical advice</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground"
                }`}
              >
                {m.content || "…"}
              </div>
            ))}

            {showQuickQuestions && (
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    disabled={isStreaming}
                    className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-primary/15 disabled:pointer-events-none disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex items-center gap-2 border-t border-border/50 p-3"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about our products…"
              disabled={isStreaming}
            />
            <Button type="submit" size="icon" disabled={isStreaming || !input.trim()} aria-label="Send message">
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
