"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { pageNavKey, pagePath, rulesMenu, type PageSlug } from "@/content/routes";
import { LanguageToggle } from "@/components/navigation/LanguageToggle";
import { RulesDropdown } from "@/components/navigation/RulesDropdown";
import { openSearch } from "@/components/navigation/SearchDialog";
import { buttonClasses } from "@/components/ui/ButtonLink";

interface Props {
  locale: Locale;
  header: Dictionary["header"];
  nav: Dictionary["nav"];
  searchLabel: string;
}

const desktopBefore = [
  "",
  "about",
  "academics",
  "admission",
  "facilities",
] as const satisfies readonly PageSlug[];
const desktopAfter = ["achievements", "gallery", "contact"] as const satisfies readonly PageSlug[];
const mobileTop = [
  "",
  "about",
  "academics",
  "admission",
  "facilities",
] as const satisfies readonly PageSlug[];
const mobileBottom = ["achievements", "gallery", "contact"] as const satisfies readonly PageSlug[];

export function SiteHeader({ locale, header, nav, searchLabel }: Props) {
  const pathname = usePathname() ?? `/${locale}`;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const isCurrent = (slug: PageSlug) => pathname === pagePath(locale, slug);
  const rulesActive =
    isCurrent("rules-and-regulations") || rulesMenu.some((slug) => isCurrent(slug));
  const label = (slug: PageSlug) => nav[pageNavKey[slug]];

  // Close the menu after navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const desktopLink = (slug: PageSlug) => (
    <li key={slug || "home"}>
      <Link
        href={pagePath(locale, slug)}
        aria-current={isCurrent(slug) ? "page" : undefined}
        className={`flex h-12 items-center px-3 text-[15px] font-semibold transition-colors hover:bg-white/10 hover:text-white ${
          isCurrent(slug) ? "text-gold-400" : "text-white/90"
        }`}
      >
        {label(slug)}
      </Link>
    </li>
  );

  const sheetLink = (slug: PageSlug, nested = false) => (
    <li key={slug || "home"}>
      <Link
        href={pagePath(locale, slug)}
        aria-current={isCurrent(slug) ? "page" : undefined}
        className={`flex min-h-12 items-center rounded-xl px-3 ${nested ? "text-base" : "text-lg font-semibold"} ${
          isCurrent(slug) ? "bg-navy-50 text-crimson-800" : "text-ink hover:bg-navy-50"
        }`}
      >
        {label(slug)}
      </Link>
    </li>
  );

  return (
    <>
      <header className="bg-paper/95 sticky top-0 z-40 backdrop-blur-sm lg:static">
        <div className="container-page flex h-16 items-center justify-between gap-3 sm:h-20">
          <Link
            href={pagePath(locale, "")}
            aria-label={header.homeLabel}
            className="flex min-w-0 items-center"
            data-testid="logo-home"
          >
            <Image
              src="/branding/nalanda-official-logo.png"
              alt=""
              width={2000}
              height={218}
              priority
              sizes="(min-width: 640px) 440px, 0px"
              className="hidden h-auto w-[300px] sm:block md:w-[380px] lg:w-[440px]"
            />
            <span className="flex items-center gap-2 sm:hidden">
              <Image
                src="/branding/nalanda-emblem.png"
                alt=""
                width={285}
                height={285}
                priority
                className="h-11 w-11"
              />
              <span className="leading-tight">
                <span
                  className="font-display text-crimson-800 block text-lg font-bold tracking-wide"
                  lang="en"
                >
                  NALANDA
                </span>
                <span
                  className="text-navy-800 block text-[11px] font-semibold tracking-wide whitespace-nowrap"
                  lang="en"
                >
                  ENG. MED. HR. SEC. SCHOOL
                </span>
              </span>
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={openSearch}
              className="text-navy-800 hover:bg-navy-50 hidden min-h-9 items-center gap-1.5 rounded-full px-3 text-sm font-semibold lg:inline-flex"
              data-testid="search-button"
            >
              <Search aria-hidden="true" size={16} />
              {searchLabel}
            </button>
            <LanguageToggle
              locale={locale}
              label={header.switchLanguage}
              ariaLabel={header.switchLanguageAria}
            />
            <span className="hidden lg:block">
              <Link href={pagePath(locale, "admission")} className={buttonClasses("primary")}>
                {header.enquire}
              </Link>
            </span>
            <button
              ref={menuButtonRef}
              type="button"
              className="text-navy-800 ring-navy-800/20 inline-flex h-11 w-11 items-center justify-center rounded-full ring-2 ring-inset lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? header.closeMenu : header.openMenu}
              onClick={() => setMenuOpen((v) => !v)}
              data-testid="menu-button"
            >
              {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {/* Phone/tablet menu: a sheet that rises from the bottom, within thumb reach. */}
      <div hidden={!menuOpen} className="lg:hidden">
        <div
          aria-hidden="true"
          className="bg-navy-950/60 fixed inset-0 z-50"
          onClick={() => setMenuOpen(false)}
        />
        <div
          id="mobile-menu"
          ref={panelRef}
          className="fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] overflow-y-auto rounded-t-3xl bg-white pb-[env(safe-area-inset-bottom)] shadow-[var(--shadow-float)]"
        >
          <nav aria-label={header.mobileNav} className="container-page pt-3 pb-6">
            <div className="mb-2 flex items-center justify-between">
              <span aria-hidden="true" className="bg-line h-1.5 w-12 rounded-full" />
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  menuButtonRef.current?.focus();
                }}
                className="text-navy-800 hover:bg-navy-50 inline-flex h-11 w-11 items-center justify-center rounded-full"
                aria-label={header.closeMenu}
              >
                <X aria-hidden="true" />
              </button>
            </div>
            <ul className="grid gap-0.5">
              {mobileTop.map((slug) => sheetLink(slug))}
              <li>
                <Link
                  href={pagePath(locale, "rules-and-regulations")}
                  aria-current={isCurrent("rules-and-regulations") ? "page" : undefined}
                  className={`flex min-h-12 items-center rounded-xl px-3 text-lg font-semibold ${
                    isCurrent("rules-and-regulations")
                      ? "bg-navy-50 text-crimson-800"
                      : "text-ink hover:bg-navy-50"
                  }`}
                >
                  {nav.rules}
                </Link>
                <ul className="ml-3 grid gap-0.5 pl-3">
                  {rulesMenu.map((slug) => sheetLink(slug, true))}
                </ul>
              </li>
              {mobileBottom.map((slug) => sheetLink(slug))}
            </ul>
            <div className="mt-4 flex flex-wrap items-center gap-3 pt-4">
              <Link href={pagePath(locale, "admission")} className={buttonClasses("primary")}>
                {header.enquire}
              </Link>
              <LanguageToggle
                locale={locale}
                label={header.switchLanguage}
                ariaLabel={header.switchLanguageAria}
                onSwitch={() => setMenuOpen(false)}
              />
            </div>
          </nav>
        </div>
      </div>

      <nav aria-label={header.mainNav} className="bg-navy-800 sticky top-0 z-40 hidden lg:block">
        <ul className="container-page flex items-center justify-center">
          {desktopBefore.map(desktopLink)}
          <li>
            <RulesDropdown
              label={nav.rules}
              overviewHref={pagePath(locale, "rules-and-regulations")}
              overviewLabel={nav.rules}
              active={rulesActive}
              items={rulesMenu.map((slug) => ({
                href: pagePath(locale, slug),
                label: label(slug),
                current: isCurrent(slug),
              }))}
            />
          </li>
          {desktopAfter.map(desktopLink)}
        </ul>
      </nav>
    </>
  );
}
