import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, LOCALE_COOKIE } from "@/i18n/config";
import { legacyRedirects, pageSlugs, type PageSlug } from "@/content/routes";

const knownSlugs = new Set<string>(pageSlugs.filter(Boolean));

/**
 * - "/" shows the language chooser on a first visit; with a saved preference
 *   it goes straight to that language's homepage.
 * - Legacy URLs from the old site and locale-less paths ("/contact") redirect
 *   to the visitor's preferred language (English if none is saved).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  const preferred = isLocale(saved) ? saved : null;

  if (pathname === "/") {
    if (!preferred) return NextResponse.next();
    return redirectTo(request, `/${preferred}`, 307);
  }

  const normalized = pathname.replace(/\/+$/, "").toLowerCase();
  const firstSegment = normalized.split("/")[1];
  if (isLocale(firstSegment)) return NextResponse.next();

  const target: PageSlug | undefined =
    legacyRedirects[normalized] ??
    (knownSlugs.has(normalized.slice(1)) ? (normalized.slice(1) as PageSlug) : undefined);

  if (target !== undefined) {
    return redirectTo(request, `/${preferred ?? defaultLocale}/${target}`, 308);
  }
  return NextResponse.next();
}

function redirectTo(request: NextRequest, path: string, status: 307 | 308) {
  const url = request.nextUrl.clone();
  url.pathname = path;
  const response = NextResponse.redirect(url, status);
  // The target depends on the language cookie, so shared caches must not reuse it.
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Vary", "Cookie");
  return response;
}

export const config = {
  matcher: [
    // Skip Next internals, API routes and files with an extension (images, PDFs, icons).
    "/((?!_next/|api/|.*\\.[a-zA-Z0-9]+$).*)",
  ],
};
