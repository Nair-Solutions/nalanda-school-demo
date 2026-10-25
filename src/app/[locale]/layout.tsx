import type { Metadata, Viewport } from "next";
import "../globals.css";
import { fontVariables } from "../fonts";
import { htmlLang, locales } from "@/i18n/config";
import { resolveLocale } from "@/lib/page";
import { getSiteUrl } from "@/lib/site";
import { jsonLdString } from "@/lib/json-ld";
import { school } from "@/content/school";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { dict } = await resolveLocale(params);
  return {
    metadataBase: new URL(getSiteUrl()),
    title: { default: dict.meta.siteName, template: `%s | ${dict.meta.siteName}` },
    description: dict.meta.defaultDescription,
    applicationName: dict.meta.siteName,
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#002d67",
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale, dict } = await resolveLocale(params);
  const siteUrl = getSiteUrl();
  const organization = {
    "@context": "https://schema.org",
    "@type": "School",
    name: school.officialName,
    alternateName: school.initials,
    slogan: school.motto,
    url: `${siteUrl}/${locale}`,
    logo: `${siteUrl}/branding/nalanda-official-logo.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: school.city,
      addressRegion: school.state,
      addressCountry: school.country,
    },
  };

  return (
    <html lang={htmlLang[locale]} className={fontVariables}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="text-navy-800 sr-only z-50 rounded-md bg-white px-4 py-2 font-semibold focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {dict.common.skipToContent}
        </a>
        <SiteHeader locale={locale} header={dict.header} nav={dict.nav} motto={dict.school.motto} />
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <SiteFooter locale={locale} dict={dict} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(organization) }}
        />
      </body>
    </html>
  );
}
