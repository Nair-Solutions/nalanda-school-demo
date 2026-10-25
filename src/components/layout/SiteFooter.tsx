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

export function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const link = (slug: PageSlug) => (
    <li key={slug || "home"}>
      <Link
        href={pagePath(locale, slug)}
        className="hover:text-gold-400 inline-block py-1 text-white/75"
      >
        {dict.nav[pageNavKey[slug]]}
      </Link>
    </li>
  );

  return (
    <footer className="bg-navy-950 mt-auto text-white">
      <div
        className="from-crimson-800 via-gold-500 to-crimson-800 h-1 bg-gradient-to-r"
        aria-hidden="true"
      />
      <div className="container-page grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link
            href={pagePath(locale, "")}
            aria-label={dict.header.homeLabel}
            className="inline-block rounded-lg bg-white p-3"
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
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">{dict.footer.blurb}</p>
          <p className="mt-4 flex items-center gap-2 text-sm text-white/70">
            <MapPin aria-hidden="true" size={16} className="text-gold-400" />
            {dict.school.place}
          </p>
        </div>

        <nav aria-labelledby="footer-explore">
          <h2
            id="footer-explore"
            className="text-gold-400 font-sans text-sm font-bold tracking-wider uppercase"
          >
            {dict.footer.exploreHeading}
          </h2>
          <ul className="mt-4 text-[15px]">{exploreLinks.map(link)}</ul>
        </nav>

        <nav aria-labelledby="footer-rules">
          <h2
            id="footer-rules"
            className="text-gold-400 font-sans text-sm font-bold tracking-wider uppercase"
          >
            {dict.footer.rulesHeading}
          </h2>
          <ul className="mt-4 text-[15px]">
            {link("rules-and-regulations")}
            {rulesMenu.map(link)}
          </ul>
        </nav>

        <div>
          <nav aria-labelledby="footer-families">
            <h2
              id="footer-families"
              className="text-gold-400 font-sans text-sm font-bold tracking-wider uppercase"
            >
              {dict.footer.familiesHeading}
            </h2>
            <ul className="mt-4 text-[15px]">{familyLinks.map(link)}</ul>
          </nav>
          <h2 className="text-gold-400 mt-8 font-sans text-sm font-bold tracking-wider uppercase">
            {dict.footer.languageHeading}
          </h2>
          <LanguageToggle
            locale={locale}
            label={dict.header.switchLanguage}
            ariaLabel={dict.header.switchLanguageAria}
            className="mt-3"
          />
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page py-5 text-sm text-white/60">
          <p>{format(dict.footer.copyright, { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  );
}
