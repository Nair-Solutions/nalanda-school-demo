import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { format, type Dictionary } from "@/i18n/get-dictionary";
import { pageNavKey, pagePath, rulesMenu, type PageSlug } from "@/content/routes";
import { LanguageToggle } from "@/components/navigation/LanguageToggle";

const exploreLinks = [
  "",
  "about",
  "academics",
  "facilities",
  "achievements",
  "gallery",
] as const satisfies readonly PageSlug[];
const familyLinks = ["admission", "contact", "privacy"] as const satisfies readonly PageSlug[];

const groupHeading = "font-sans text-base font-bold text-gold-400";

/** A designed close: the links, then the school's name at full width. */
export function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const link = (slug: PageSlug) => (
    <li key={slug || "home"}>
      <Link
        href={pagePath(locale, slug)}
        className="inline-block py-1.5 text-white/85 hover:text-white hover:underline"
      >
        {dict.nav[pageNavKey[slug]]}
      </Link>
    </li>
  );

  return (
    <footer className="bg-navy-950 mt-auto text-white">
      <div className="container-page grid gap-10 pt-16 pb-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link
            href={pagePath(locale, "")}
            aria-label={dict.header.homeLabel}
            className="inline-block rounded-xl bg-white p-3"
          >
            <Image
              src="/branding/nalanda-official-logo.png"
              alt=""
              width={2000}
              height={218}
              sizes="300px"
              className="h-auto w-[260px] sm:w-[300px]"
            />
          </Link>
          <p className="mt-6 max-w-sm text-base text-white/80">{dict.footer.blurb}</p>
          <p className="mt-4 flex items-center gap-2 text-base text-white/80">
            <MapPin aria-hidden="true" size={18} className="text-gold-400" />
            {dict.school.place}
          </p>
        </div>

        <nav aria-labelledby="footer-explore">
          <h2 id="footer-explore" className={groupHeading}>
            {dict.footer.exploreHeading}
          </h2>
          <ul className="mt-4 text-base">{exploreLinks.map(link)}</ul>
        </nav>

        <nav aria-labelledby="footer-rules">
          <h2 id="footer-rules" className={groupHeading}>
            {dict.footer.rulesHeading}
          </h2>
          <ul className="mt-4 text-base">
            {link("rules-and-regulations")}
            {rulesMenu.map(link)}
          </ul>
        </nav>

        <div>
          <nav aria-labelledby="footer-families">
            <h2 id="footer-families" className={groupHeading}>
              {dict.footer.familiesHeading}
            </h2>
            <ul className="mt-4 text-base">{familyLinks.map(link)}</ul>
          </nav>
          <h2 className={`${groupHeading} mt-8`}>{dict.footer.languageHeading}</h2>
          <LanguageToggle
            locale={locale}
            label={dict.header.switchLanguage}
            ariaLabel={dict.header.switchLanguageAria}
            className="mt-3"
          />
        </div>
      </div>

      {/* Extra bottom space on phones so the fixed action bar never covers the last line. */}
      <div className="container-page pb-[calc(6.5rem+env(safe-area-inset-bottom))] lg:pb-10">
        <p className="text-heading text-white" aria-hidden="true">
          {dict.school.name}
        </p>
        <p className="font-display text-gold-400 mt-2 text-lg" lang="en" aria-hidden="true">
          “{dict.school.motto}”
        </p>
        <p className="mt-8 text-sm text-white/70">
          {format(dict.footer.copyright, { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
