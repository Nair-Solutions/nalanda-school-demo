import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, type Locale } from "./config";

/** Persist the visitor's language choice (client-side only). */
export function saveLocalePreference(locale: Locale): void {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
}
