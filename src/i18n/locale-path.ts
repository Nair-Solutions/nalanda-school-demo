import { isLocale, type Locale } from "./config";

/** Swap (or add) the locale segment of a pathname, keeping the rest of the path. */
export function switchLocalePath(pathname: string, target: Locale): string {
  const segments = pathname.split("/");
  if (isLocale(segments[1])) {
    segments[1] = target;
    return segments.join("/") || `/${target}`;
  }
  return `/${target}${pathname === "/" ? "" : pathname}`;
}
