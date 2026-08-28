import { NextResponse } from "next/server";

const PROVIDER_URL = "https://zgspfwcx.cn/qr/fwqueryjson";
const MAX_CODE_LENGTH = 64;
const TIMEOUT_MS = 8000;

interface ProviderResponse {
  result: string;
  cs: number | string;
  date: string;
  date2: string;
  fwcode: string;
  state: number | string;
}

export async function POST(request: Request) {
  let code: unknown;
  try {
    const body = await request.json();
    code = body?.code;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  if (typeof code !== "string" || !code.trim() || code.trim().length > MAX_CODE_LENGTH) {
    return NextResponse.json({ ok: false, error: "invalid_code" }, { status: 400 });
  }

  const fwcode = code.trim();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const providerRes = await fetch(PROVIDER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: new URLSearchParams({ fwcode }).toString(),
      signal: controller.signal,
      cache: "no-store",
    });

    if (!providerRes.ok) {
      return NextResponse.json({ ok: false, error: "provider_error" }, { status: 502 });
    }

    const data = (await providerRes.json()) as ProviderResponse;
    const state = Number(data.state);
    const cs = Number(data.cs);

    return NextResponse.json({
      ok: true,
      genuine: state > 0,
      firstScan: state === 1,
      scanCount: Number.isFinite(cs) ? cs : null,
      firstScanDate: data.date2 || data.date || null,
      fwcode: data.fwcode ?? fwcode,
    });
  } catch (err) {
    const isAbort = err instanceof Error && err.name === "AbortError";
    return NextResponse.json(
      { ok: false, error: isAbort ? "timeout" : "network_error" },
      { status: 502 },
    );
  } finally {
    clearTimeout(timeout);
  }
}
