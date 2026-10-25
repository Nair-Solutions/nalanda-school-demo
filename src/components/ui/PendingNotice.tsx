import { Clock } from "lucide-react";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import { pagePath } from "@/content/routes";
import { ButtonLink } from "./ButtonLink";

interface Props {
  dict: Dictionary;
  locale: Locale;
  /** Optional page-specific explanation shown under the standard message. */
  detail?: string;
  heading?: string;
  showCta?: boolean;
}

/** Honest empty state for content the school has not supplied yet. */
export function PendingNotice({ dict, locale, detail, heading, showCta = true }: Props) {
  return (
    <section
      className="border-gold-500/60 bg-gold-100/40 rounded-2xl border border-dashed p-6 sm:p-8"
      data-testid="pending-notice"
    >
      <div className="flex items-start gap-4">
        <span className="text-gold-500 mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
          <Clock aria-hidden="true" size={20} />
        </span>
        <div>
          <h2 className="text-navy-900 text-xl font-semibold">{heading ?? dict.pending.title}</h2>
          {detail && <p className="text-muted mt-2">{detail}</p>}
          <p className="text-muted mt-2">{dict.pending.body}</p>
          {showCta && (
            <ButtonLink href={pagePath(locale, "contact")} variant="secondary" className="mt-5">
              {dict.pending.cta}
            </ButtonLink>
          )}
        </div>
      </div>
    </section>
  );
}
