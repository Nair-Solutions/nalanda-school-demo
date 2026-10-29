"use client";

import Link from "next/link";
import { MessageCircle, Phone, Search, Send } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { pagePath } from "@/content/routes";
import { openSearch } from "@/components/navigation/SearchDialog";

interface Props {
  locale: Locale;
  t: Dictionary["mobileBar"];
  /** Verified numbers only (src/content/school.ts). Call/WhatsApp stay hidden until supplied. */
  phone: string | null;
  whatsapp: string | null;
}

const item =
  "flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl text-[13px] font-semibold transition-transform active:scale-[0.97]";

/** Thumb-reach actions on phones and tablets (Revolut/Oura pattern). */
export function MobileActionBar({ locale, t, phone, whatsapp }: Props) {
  return (
    <nav
      aria-label={t.label}
      className="fixed inset-x-0 bottom-0 z-30 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[var(--shadow-float)] backdrop-blur-sm lg:hidden"
      data-testid="mobile-action-bar"
    >
      <div className="container-page flex gap-1 py-1.5">
        <Link
          href={`${pagePath(locale, "admission")}#admission-form`}
          className={`${item} bg-crimson-800 text-white`}
        >
          <Send aria-hidden="true" size={18} />
          {t.enquire}
        </Link>
        <button
          type="button"
          onClick={openSearch}
          className={`${item} text-navy-800 hover:bg-navy-50`}
        >
          <Search aria-hidden="true" size={18} />
          {t.search}
        </button>
        {phone && (
          <a
            href={`tel:${phone.replace(/[^\d+]/g, "")}`}
            className={`${item} text-navy-800 hover:bg-navy-50`}
          >
            <Phone aria-hidden="true" size={18} />
            {t.call}
          </a>
        )}
        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${item} text-navy-800 hover:bg-navy-50`}
          >
            <MessageCircle aria-hidden="true" size={18} />
            {t.whatsapp}
          </a>
        )}
      </div>
    </nav>
  );
}
