"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { saveLocalePreference } from "@/i18n/locale-cookie";

interface Props {
  locale: Locale;
  title: string;
  subtitle: string;
  primary?: boolean;
}

export function LanguageChoice({ locale, title, subtitle, primary = false }: Props) {
  return (
    <Link
      href={`/${locale}`}
      hrefLang={locale}
      lang={locale}
      onClick={() => saveLocalePreference(locale)}
      data-testid={`choose-${locale}`}
      className={`group flex items-center justify-between gap-4 rounded-xl p-5 text-left transition-colors sm:p-6 ${
        primary
          ? "bg-navy-800 hover:bg-navy-900 text-white"
          : "border-navy-800/15 text-navy-900 hover:border-navy-800 border-2 bg-white"
      }`}
    >
      <span>
        <span className="font-display block text-2xl font-bold">{title}</span>
        <span className={`mt-1 block text-[15px] ${primary ? "text-white/75" : "text-muted"}`}>
          {subtitle}
        </span>
      </span>
      <ArrowRight
        aria-hidden="true"
        className="shrink-0 transition-transform group-hover:translate-x-1"
      />
    </Link>
  );
}
