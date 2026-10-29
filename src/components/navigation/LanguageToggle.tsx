"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { switchLocalePath } from "@/i18n/locale-path";
import { saveLocalePreference } from "@/i18n/locale-cookie";

interface Props {
  locale: Locale;
  label: string;
  ariaLabel: string;
  className?: string;
  onSwitch?: () => void;
}

/**
 * Compact pill that switches to the other language on the same page. It is a
 * real link (works without JavaScript); the click also saves the preference.
 */
export function LanguageToggle({ locale, label, ariaLabel, className = "", onSwitch }: Props) {
  const pathname = usePathname() ?? `/${locale}`;
  const target: Locale = locale === "en" ? "hi" : "en";

  return (
    <Link
      href={switchLocalePath(pathname, target)}
      hrefLang={target}
      data-testid="language-toggle"
      onClick={() => {
        saveLocalePreference(target);
        onSwitch?.();
      }}
      className={`border-navy-800/20 text-navy-800 hover:border-navy-800 hover:bg-navy-50 inline-flex min-h-9 items-center gap-1.5 rounded-full border bg-white px-3 py-1 text-sm font-semibold shadow-sm transition-colors ${className}`}
    >
      <Languages aria-hidden="true" size={16} />
      <span lang={target}>{label}</span>
      <span className="sr-only"> – {ariaLabel}</span>
    </Link>
  );
}
