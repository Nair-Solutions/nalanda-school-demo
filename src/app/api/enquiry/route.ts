import { NextResponse, type NextRequest } from "next/server";
import { MIN_FILL_MS, validateEnquiry, type EnquiryStatus } from "@/lib/enquiry-schema";
import { deliverEnquiry } from "@/lib/enquiry-delivery";
import { rateLimit } from "@/lib/rate-limit";
import { isLocale } from "@/i18n/config";

const MAX_BODY_BYTES = 8 * 1024;

function fail(status: number, code: EnquiryStatus, extra: Record<string, unknown> = {}) {
  return NextResponse.json({ ok: false, status: code, ...extra }, { status });
}

export async function POST(request: NextRequest) {
  // Same-origin only: browsers always send Origin on cross-site POSTs.
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== request.headers.get("host")) {
    return fail(403, "failed");
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (!rateLimit(`enquiry:${ip}`, 5, 10 * 60 * 1000)) {
    return fail(429, "rateLimited");
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return fail(413, "invalid");

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      throw new Error("not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return fail(400, "invalid");
  }

  // Spam traps: a hidden field humans leave empty, and a minimum fill time.
  // Bots get a normal-looking success so they don't learn to adapt.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }
  const startedAt = Number(body.startedAt);
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS) {
    return fail(400, "tooFast");
  }

  const result = validateEnquiry(body);
  if (!result.ok) return fail(422, "invalid", { errors: result.errors });

  const locale = typeof body.locale === "string" && isLocale(body.locale) ? body.locale : "en";

  try {
    const delivery = await deliverEnquiry(result.data, locale);
    if (delivery === "sent") return NextResponse.json({ ok: true });
    if (delivery === "notConfigured") return fail(503, "notConfigured");
    return fail(502, "failed");
  } catch (error) {
    console.error("Enquiry delivery failed", error instanceof Error ? error.message : error);
    return fail(502, "failed");
  }
}
