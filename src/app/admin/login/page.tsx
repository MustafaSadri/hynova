"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

function AdminLoginForm() {
  const { language } = useLanguage();
  const t = translations[language].admin;
  const router = useRouter();
  const searchParams = useSearchParams();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(
          data.error === "not_configured" ? t.loginErrorNotConfigured : t.loginErrorInvalid,
        );
        setSubmitting(false);
        return;
      }

      const redirectTo = searchParams.get("redirect") || "/admin/rsvps";
      router.push(redirectTo);
      router.refresh();
    } catch {
      setError(t.loginErrorGeneric);
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8"
      >
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-neutral-100">
          <Lock className="size-5 text-neutral-500" strokeWidth={1.5} />
        </div>
        <h1 className="mt-4 text-center text-xl font-medium text-neutral-900">
          {t.loginTitle}
        </h1>

        <div className="mt-6 flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium uppercase tracking-widest text-neutral-400">
              {t.loginUsernameLabel}
            </label>
            <input
              type="text"
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-teal-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-widest text-neutral-400">
              {t.loginPasswordLabel}
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 h-11 w-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-sm font-medium text-white hover:from-teal-400 hover:to-cyan-400 disabled:opacity-50"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              {t.loginSubmitting}
            </span>
          ) : (
            t.loginSubmit
          )}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <AdminLoginForm />
    </Suspense>
  );
}
