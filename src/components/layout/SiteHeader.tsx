"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { pageNavKey, pagePath, rulesMenu, type PageSlug } from "@/content/routes";
import { LanguageToggle } from "@/components/navigation/LanguageToggle";
import { RulesDropdown } from "@/components/navigation/RulesDropdown";
import { buttonClasses } from "@/components/ui/ButtonLink";

interface Props {
  locale: Locale;
  header: Dictionary["header"];
  nav: Dictionary["nav"];
  motto: string;
}

const desktopBefore = [
  "",
  "about",
  "academics",
  "admission",
  "facilities",
] as const satisfies readonly PageSlug[];
const desktopAfter = ["achievements", "gallery", "contact"] as const satisfies readonly PageSlug[];
const mobileOrder = [
  "",
  "about",
  "academics",
  "admission",
  "facilities",
  "achievements",
  "gallery",
  "contact",
] as const satisfies readonly PageSlug[];

export function SiteHeader({ locale, header, nav, motto }: Props) {
  const pathname = usePathname() ?? `/${locale}`;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const isCurrent = (slug: PageSlug) => pathname === pagePath(locale, slug);
  const rulesActive =
    isCurrent("rules-and-regulations") || rulesMenu.some((slug) => isCurrent(slug));
  const label = (slug: PageSlug) => nav[pageNavKey[slug]];

  // Close the mobile menu after navigation.
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
        className={`flex h-12 items-center px-3 text-[15px] font-medium transition-colors hover:bg-white/10 hover:text-white ${
          isCurrent(slug) ? "text-gold-400" : "text-white/90"
        }`}
      >
        {label(slug)}
      </Link>
    </li>
  );

  const mobileLink = (slug: PageSlug, nested = false) => (
    <li key={slug || "home"}>
      <Link
        href={pagePath(locale, slug)}
        aria-current={isCurrent(slug) ? "page" : undefined}
        className={`flex min-h-11 items-center rounded-lg px-3 ${nested ? "text-[15px]" : "text-base font-medium"} ${
          isCurrent(slug)
            ? "bg-navy-50 text-crimson-800 font-semibold"
            : "text-ink hover:bg-navy-50"
        }`}
      >
        {label(slug)}
      </Link>
    </li>
  );

  return (
    <>
      <div className="bg-navy-950 hidden text-sm text-white/80 md:block">
        <div className="container-page flex h-9 items-center justify-between">
          <p className="font-display text-gold-400 italic" lang="en">
            “{motto}”
          </p>
          <Link
            href={pagePath(locale, "admission")}
            className="hover:text-gold-400 font-semibold text-white"
          >
            {header.enquire} →
          </Link>
        </div>
      </div>

      <header className="border-line sticky top-0 z-40 border-b bg-white/95 backdrop-blur lg:static">
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
                  className="text-navy-800 block text-[11px] font-semibold tracking-wide"
                  lang="en"
                >
                  ENGLISH MEDIUM HR. SEC. SCHOOL
                </span>
              </span>
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <LanguageToggle
              locale={locale}
              label={header.switchLanguage}
              ariaLabel={header.switchLanguageAria}
            />
            <Link
              href={pagePath(locale, "admission")}
              className={buttonClasses("primary", "hidden lg:inline-flex")}
            >
              {header.enquire}
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              className="border-line text-navy-800 inline-flex h-11 w-11 items-center justify-center rounded-lg border lg:hidden"
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

        <div
          id="mobile-menu"
          ref={panelRef}
          hidden={!menuOpen}
          className="border-line max-h-[calc(100dvh-4rem)] overflow-y-auto border-t bg-white lg:hidden"
        >
          <nav aria-label={header.mobileNav} className="container-page py-4">
            <ul className="grid gap-1">
              {mobileOrder.slice(0, 5).map((slug) => mobileLink(slug))}
              <li>
                <Link
                  href={pagePath(locale, "rules-and-regulations")}
                  aria-current={isCurrent("rules-and-regulations") ? "page" : undefined}
                  className={`flex min-h-11 items-center rounded-lg px-3 text-base font-medium ${
                    isCurrent("rules-and-regulations")
                      ? "bg-navy-50 text-crimson-800 font-semibold"
                      : "text-ink hover:bg-navy-50"
                  }`}
                >
                  {nav.rules}
                </Link>
                <ul className="border-gold-400 ml-3 grid gap-0.5 border-l-2 pl-2">
                  {rulesMenu.map((slug) => mobileLink(slug, true))}
                </ul>
              </li>
              {mobileOrder.slice(5).map((slug) => mobileLink(slug))}
            </ul>
            <div className="border-line mt-4 flex flex-wrap items-center gap-3 border-t pt-4">
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
      </header>

      <nav
        aria-label={header.mainNav}
        className="bg-navy-800 sticky top-0 z-40 hidden shadow-md lg:block"
      >
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
