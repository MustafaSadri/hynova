"use client";

import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { CheckCircle2, Loader2, ShieldAlert, XCircle } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";
import type { Guest, RegistrationStatus } from "@/lib/rsvp";

interface LookupRegistration {
  fullName: string;
  guestCount: number;
  guests: Guest[];
  status: RegistrationStatus;
  checkinCount: number;
  firstCheckedInAt: string | null;
  lastCheckedInAt: string | null;
}

type Phase = "idle" | "looking-up" | "result" | "error";

// A scanned QR encodes the same check-in URL this page lives at
// (`/admin/check-in?token=...`), so a phone's own camera app opening that
// URL already does the right thing — this in-page scanner is just a
// convenience for staff who'd rather not leave the page to use it.
function extractToken(text: string): string {
  try {
    const url = new URL(text);
    const param = url.searchParams.get("token");
    if (param) return param;
  } catch {
    // Not a URL — treat the raw decoded text as the token itself.
  }
  return text.trim();
}

export function CheckInScanner({ initialToken }: { initialToken?: string }) {
  const { language } = useLanguage();
  const t = translations[language].admin;

  const [token, setToken] = useState(initialToken ?? "");
  const [phase, setPhase] = useState<Phase>("idle");
  const [found, setFound] = useState(true);
  const [blocked, setBlocked] = useState(false);
  const [registration, setRegistration] = useState<LookupRegistration | null>(null);
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [justConfirmed, setJustConfirmed] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const autoLookedUpRef = useRef(false);

  async function lookup(rawToken: string) {
    const trimmed = rawToken.trim();
    if (!trimmed) return;
    setPhase("looking-up");
    setBlocked(false);
    setJustConfirmed(false);
    try {
      const res = await fetch("/api/admin/check-in/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: trimmed }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setPhase("error");
        return;
      }
      setFound(data.found);
      setRegistration(data.found ? data.registration : null);
      setPhase("result");
    } catch {
      setPhase("error");
    }
  }

  async function confirmEntry() {
    if (!token.trim()) return;
    setConfirming(true);
    try {
      const res = await fetch("/api/admin/check-in/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setPhase("error");
        return;
      }
      setFound(data.found);
      setBlocked(Boolean(data.blocked));
      setJustConfirmed(data.found && !data.blocked);
      setRegistration(data.found ? data.registration ?? registration : null);
      setPhase("result");
    } catch {
      setPhase("error");
    } finally {
      setConfirming(false);
    }
  }

  useEffect(() => {
    if (initialToken && !autoLookedUpRef.current) {
      autoLookedUpRef.current = true;
      void lookup(initialToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stopScan() {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setScanning(false);
  }

  function scanFrame() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      rafRef.current = requestAnimationFrame(scanFrame);
      return;
    }
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      rafRef.current = requestAnimationFrame(scanFrame);
      return;
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const result = jsQR(imageData.data, imageData.width, imageData.height);
    if (result?.data) {
      const detected = extractToken(result.data);
      stopScan();
      setToken(detected);
      void lookup(detected);
      return;
    }
    rafRef.current = requestAnimationFrame(scanFrame);
  }

  async function startScan() {
    setCameraError(false);
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(true);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      setScanning(true);
    } catch {
      setCameraError(true);
    }
  }

  useEffect(() => {
    if (!scanning) return;
    const video = videoRef.current;
    const stream = streamRef.current;
    if (!video || !stream) return;
    video.srcObject = stream;
    video.play().catch(() => {});
    rafRef.current = requestAnimationFrame(scanFrame);
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanning]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  function formatTime(iso: string) {
    return new Date(iso).toLocaleString(language === "ru" ? "ru-RU" : "en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  const isCancelled = registration?.status === "cancelled" || blocked;
  const alreadyCheckedIn = (registration?.checkinCount ?? 0) > 0;

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-medium text-neutral-900">{t.checkInHeading}</h1>
      <p className="mt-1 text-sm text-neutral-500">{t.checkInSubtitle}</p>

      <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6">
        {scanning ? (
          <div className="flex flex-col items-center">
            <div className="relative w-full overflow-hidden rounded-xl bg-black">
              <video ref={videoRef} muted playsInline className="h-64 w-full object-cover" />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="size-40 rounded-2xl border-2 border-white/80" />
              </div>
            </div>
            <canvas ref={canvasRef} className="hidden" />
            <p className="mt-4 text-sm text-neutral-500">{t.checkInScanningHint}</p>
            <button
              type="button"
              onClick={stopScan}
              className="mt-4 h-11 rounded-full border border-neutral-200 px-6 text-sm text-neutral-700 hover:bg-neutral-50"
            >
              {t.checkInStopScanButton}
            </button>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => void startScan()}
              className="h-12 w-full rounded-full bg-neutral-900 text-sm font-medium text-white hover:bg-neutral-800"
            >
              {t.checkInScanButton}
            </button>
            {cameraError && (
              <p className="mt-2 text-xs text-amber-600">{t.checkInCameraUnavailable}</p>
            )}

            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder={t.checkInTokenPlaceholder}
                aria-label={t.checkInTokenLabel}
                className="h-11 flex-1 rounded-full border border-neutral-200 px-4 font-mono text-xs outline-none focus:border-teal-500"
              />
              <button
                type="button"
                onClick={() => void lookup(token)}
                disabled={phase === "looking-up" || !token.trim()}
                className="h-11 shrink-0 rounded-full border border-neutral-200 px-5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
              >
                {phase === "looking-up" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  t.checkInLookupButton
                )}
              </button>
            </div>
          </>
        )}

        {phase === "error" && (
          <p className="mt-4 text-sm text-red-600">{t.checkInError}</p>
        )}

        {phase === "result" && (
          <div className="mt-5 rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
            {!found ? (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <XCircle className="size-5 shrink-0" />
                {t.checkInNotFound}
              </div>
            ) : (
              <>
                {isCancelled && (
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-red-600">
                    <ShieldAlert className="size-5 shrink-0" />
                    {t.checkInCancelledWarning}
                  </div>
                )}
                <p className="font-medium text-neutral-900">{registration?.fullName}</p>
                <p className="mt-1 text-sm text-teal-700">
                  {t.checkInAdmits.replace("{n}", String(registration?.guestCount ?? 0))}
                </p>
                {registration && registration.guests.length > 0 && (
                  <div className="mt-2 text-xs text-neutral-500">
                    <p>{t.checkInAdditionalGuests}</p>
                    <ul className="mt-1">
                      {registration.guests.map((g, i) => (
                        <li key={i}>
                          {g.name}
                          {g.phone && ` — ${g.phone}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {justConfirmed && (
                  <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-teal-700">
                    <CheckCircle2 className="size-3.5" />
                    {t.checkInConfirmedJustNow}
                  </p>
                )}
                {alreadyCheckedIn && !justConfirmed && registration?.firstCheckedInAt && (
                  <p className="mt-3 text-xs font-medium text-amber-600">
                    {t.checkInAlreadyCheckedIn
                      .replace("{n}", String(registration.checkinCount))
                      .replace("{time}", formatTime(registration.firstCheckedInAt))}
                  </p>
                )}

                {!isCancelled && (
                  <button
                    type="button"
                    onClick={() => void confirmEntry()}
                    disabled={confirming}
                    className="mt-4 h-11 w-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-sm font-medium text-white hover:from-teal-400 hover:to-cyan-400 disabled:opacity-50"
                  >
                    {confirming ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="size-4 animate-spin" />
                        {t.checkInConfirming}
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="size-4" />
                        {t.checkInConfirmButton}
                      </span>
                    )}
                  </button>
                )}
              </>
            )}

            <button
              type="button"
              onClick={() => {
                setPhase("idle");
                setToken("");
                setRegistration(null);
                setBlocked(false);
                setJustConfirmed(false);
              }}
              className="mt-3 w-full text-center text-xs text-neutral-500 hover:text-neutral-700"
            >
              {t.checkInScanAnother}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
