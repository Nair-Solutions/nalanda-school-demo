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
    <section className="bg-gold-100/70 rounded-2xl p-6 sm:p-8" data-testid="pending-notice">
      <h2 className="text-title text-navy-900 flex items-center gap-2.5">
        <Clock aria-hidden="true" size={22} className="text-crimson-800 shrink-0" />
        {heading ?? dict.pending.title}
      </h2>
      <div className="measure text-body text-ink mt-3 space-y-2">
        {detail && <p>{detail}</p>}
        <p>{dict.pending.body}</p>
      </div>
      {showCta && (
        <ButtonLink href={pagePath(locale, "contact")} variant="secondary" className="mt-6">
          {dict.pending.cta}
        </ButtonLink>
      )}
    </section>
  );
}
