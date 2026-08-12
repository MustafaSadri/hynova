"use client";

import { useState, type FormEvent } from "react";
import { ChevronDown } from "lucide-react";

const INTERESTS = [
  "General Updates",
  "Injectable Pens",
  "Lyophilized Vials",
  "Oral Tablets",
  "Partnership & Distribution",
];

export function Contact() {
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !interest) return;
    setSubmitted(true);
  }

  return (
    <section
      id="contact"
      className="relative bg-white px-6 pt-8 pb-24 md:pt-12 md:pb-32"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-light tracking-tight text-neutral-900 sm:text-5xl">
          Get{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-neutral-900 to-cyan-600">
            Product Updates
          </span>
        </h2>
        <p className="mt-5 text-base leading-relaxed text-neutral-500">
          Leave your email and let us know what you&apos;re interested in —
          we&apos;ll keep you posted on new formulations and availability.
        </p>

        {submitted ? (
          <div className="mt-10 rounded-2xl border border-teal-200 bg-teal-50 px-6 py-5 text-sm text-teal-800">
            Thank you — we&apos;ll keep <span className="font-medium">{email}</span>{" "}
            updated on {interest.toLowerCase()}.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-10 flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-label="Email address"
              className="h-12 flex-1 rounded-full border border-neutral-200 bg-white px-5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-teal-500"
            />

            <div className="relative">
              <select
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                required
                aria-label="I'm interested in"
                className="h-12 w-full appearance-none rounded-full border border-neutral-200 bg-white px-5 pr-10 text-sm text-neutral-900 outline-none transition-colors focus:border-teal-500 sm:w-56"
              >
                <option value="" disabled>
                  I&apos;m interested in…
                </option>
                {INTERESTS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
            </div>

            <button
              type="submit"
              className="h-12 shrink-0 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 px-7 text-sm font-medium text-white shadow-[0_8px_20px_rgba(13,148,136,0.25)] transition hover:from-teal-400 hover:to-cyan-400"
            >
              Notify Me
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
