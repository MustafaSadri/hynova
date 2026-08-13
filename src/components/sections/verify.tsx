"use client";

import { useRef, useState, type FormEvent } from "react";
import {
  Camera,
  CheckCircle2,
  KeyRound,
  Loader2,
  ScanLine,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";

type Mode = "code" | "photo";
type Status = "idle" | "submitting" | "submitted";

export function Verify() {
  const [mode, setMode] = useState<Mode>("code");
  const [code, setCode] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  const scanInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const canSubmit =
    status !== "submitting" && (mode === "code" ? code.trim().length > 0 : !!file);

  function handleFile(selected: File | null) {
    setFile(selected);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return selected ? URL.createObjectURL(selected) : null;
    });
  }

  function reset() {
    setCode("");
    handleFile(null);
    setStatus("idle");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("submitting");
    // Verification isn't wired to a backend yet — this just gives the UI a
    // real submit → processing → confirmation flow to build against later.
    setTimeout(() => setStatus("submitted"), 1000);
  }

  return (
    <>
      <PageHeader maxWidth="max-w-xl" />

      <section className="relative bg-white px-6 pt-20 pb-24 md:pt-28 md:pb-32">
      <div className="mx-auto max-w-xl">
        <div className="text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-teal-100 bg-teal-50">
            <ShieldCheck className="size-7 text-teal-600" strokeWidth={1.5} />
          </div>
          <h1 className="mt-6 text-4xl font-light tracking-tight text-neutral-900 sm:text-5xl">
            Verify Your{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-neutral-900 to-cyan-600">
              Product.
            </span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-neutral-500">
            Enter the batch code printed on your box, or scan / upload a
            photo of the label to confirm it&apos;s a genuine Cynapept
            product.
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-neutral-200 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-8">
          {status === "submitted" ? (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-teal-50">
                <CheckCircle2 className="size-7 text-teal-600" strokeWidth={1.5} />
              </div>
              <h2 className="mt-5 text-xl font-medium text-neutral-900">
                Request received
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-neutral-500">
                We&apos;ve received your verification request
                {mode === "code" && code ? (
                  <>
                    {" "}
                    for code <span className="font-medium text-neutral-700">{code}</span>
                  </>
                ) : null}
                . Automated verification is being finalized — we&apos;ll be
                in touch if we need anything else.
              </p>
              <button
                type="button"
                onClick={reset}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "mt-6 h-11 rounded-full border-neutral-200 px-6 text-neutral-700 hover:bg-neutral-50",
                )}
              >
                Verify another product
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-1 rounded-full bg-neutral-100 p-1">
                <button
                  type="button"
                  onClick={() => setMode("code")}
                  className={cn(
                    "flex h-9 items-center justify-center gap-1.5 rounded-full text-sm font-medium transition-colors",
                    mode === "code"
                      ? "bg-white text-neutral-900 shadow-sm"
                      : "text-neutral-500 hover:text-neutral-700",
                  )}
                >
                  <KeyRound className="size-4" />
                  Enter Code
                </button>
                <button
                  type="button"
                  onClick={() => setMode("photo")}
                  className={cn(
                    "flex h-9 items-center justify-center gap-1.5 rounded-full text-sm font-medium transition-colors",
                    mode === "photo"
                      ? "bg-white text-neutral-900 shadow-sm"
                      : "text-neutral-500 hover:text-neutral-700",
                  )}
                >
                  <ScanLine className="size-4" />
                  Scan or Upload
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-6">
                {mode === "code" ? (
                  <div key="code-mode">
                    <label
                      htmlFor="verify-code"
                      className="text-xs font-medium uppercase tracking-widest text-neutral-400"
                    >
                      Batch Code
                    </label>
                    <input
                      id="verify-code"
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="e.g. CYN-2K9F-7QRT"
                      autoComplete="off"
                      className="mt-2 h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 font-mono text-sm tracking-wide text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-teal-500"
                    />
                    <p className="mt-2 text-xs text-neutral-400">
                      Found on the box, near the batch number.
                    </p>
                  </div>
                ) : (
                  <div key="photo-mode">
                    <input
                      ref={scanInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                    />
                    <input
                      ref={uploadInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                    />

                    {previewUrl ? (
                      <div className="relative overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={previewUrl}
                          alt="Selected product photo"
                          className="h-56 w-full object-contain p-3"
                        />
                        <button
                          type="button"
                          onClick={() => handleFile(null)}
                          aria-label="Remove photo"
                          className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/90 text-neutral-600 shadow-sm backdrop-blur hover:bg-white"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => scanInputRef.current?.click()}
                          className="flex h-32 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-200 text-neutral-500 transition-colors hover:border-teal-400 hover:text-teal-600"
                        >
                          <Camera className="size-6" strokeWidth={1.5} />
                          <span className="text-sm font-medium">Scan Photo</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => uploadInputRef.current?.click()}
                          className="flex h-32 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-200 text-neutral-500 transition-colors hover:border-teal-400 hover:text-teal-600"
                        >
                          <Upload className="size-6" strokeWidth={1.5} />
                          <span className="text-sm font-medium">Upload Photo</span>
                        </button>
                      </div>
                    )}
                    <p className="mt-2 text-xs text-neutral-400">
                      Include the label showing the batch code and QR code.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "mt-6 h-12 w-full rounded-full border-0 bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-[0_8px_20px_rgba(13,148,136,0.25)] transition hover:from-teal-400 hover:to-cyan-400 disabled:opacity-40 disabled:shadow-none",
                  )}
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Verifying…
                    </>
                  ) : (
                    "Verify Product"
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 border-t border-neutral-100 pt-10 sm:grid-cols-3">
          {[
            {
              title: "Unique per unit",
              body: "Every box ships with its own batch code, logged at manufacture.",
            },
            {
              title: "Cold-chain verified",
              body: "Storage and shipping conditions are tracked for every batch.",
            },
            {
              title: "Report a concern",
              body: "Think you've received a suspicious product? Let us know.",
            },
          ].map((item) => (
            <div key={item.title}>
              <p className="text-sm font-medium text-neutral-900">{item.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
      </section>
    </>
  );
}
