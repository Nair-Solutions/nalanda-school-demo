import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Medal } from "lucide-react";
import type { Metadata } from "next";
import { resolveLocale } from "@/lib/page";
import { pageMetadata } from "@/lib/metadata";
import { format } from "@/i18n/get-dictionary";
import { pageNavKey, pagePath, type PageSlug } from "@/content/routes";
import { judoResults2026 } from "@/content/achievements";
import { mapsPhotoCollections } from "@/content/school";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { ResourceCards } from "@/components/ui/ResourceCards";
import { pageIcons } from "@/components/ui/page-icons";
import { PosterViewer } from "@/components/achievements/PosterViewer";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale, dict } = await resolveLocale(params);
  return pageMetadata({ locale, slug: "", title: dict.home.metaTitle });
}

const quickLinks = [
  "rules-and-regulations",
  "academic-calendar",
  "book-list",
  "teachers",
  "public-disclosure",
  "contact",
] as const satisfies readonly PageSlug[];

const medalTone = {
  gold: "text-[#b8860b]",
  silver: "text-slate-500",
  medal: "text-[#a0612b]",
} as const;

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale, dict } = await resolveLocale(params);
  const t = dict.home;

  return (
    <>
      {/* Hero */}
      <section className="bg-navy-900 relative overflow-hidden text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute top-10 -left-40 h-[30rem] w-[30rem] rounded-full border-[56px] border-white/[0.035]" />
          <div className="bg-navy-700/40 absolute -top-24 -right-10 h-[26rem] w-[26rem] rounded-full blur-3xl" />
        </div>
        <div className="container-page relative grid items-center gap-10 pt-12 pb-28 sm:pt-16 lg:grid-cols-[1.25fr_0.75fr] lg:pt-20 lg:pb-36">
          <div>
            <p className="text-gold-400 text-sm font-semibold tracking-[0.18em] uppercase">
              {t.heroEyebrow}
            </p>
            <h1 className="mt-4 text-4xl leading-[1.1] font-bold sm:text-5xl lg:text-6xl">
              {dict.school.name}
            </h1>
            <p className="font-display text-gold-400 mt-5 text-xl italic sm:text-2xl" lang="en">
              “{dict.school.motto}”
            </p>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">{t.heroLead}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={pagePath(locale, "admission")} variant="onDark">
                {t.heroPrimary}
                <ArrowRight aria-hidden="true" size={18} />
              </ButtonLink>
              <ButtonLink href={pagePath(locale, "about")} variant="outlineOnDark">
                {t.heroSecondary}
              </ButtonLink>
            </div>
          </div>
          <div className="relative mx-auto hidden w-full max-w-sm sm:block">
            <div
              aria-hidden="true"
              className="border-gold-400/30 absolute inset-0 -m-6 rounded-full border"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 -m-12 rounded-full border border-white/10"
            />
            <div className="relative aspect-square rounded-full bg-white p-8 shadow-2xl ring-8 ring-white/10">
              <Image
                src="/branding/nalanda-emblem.png"
                alt=""
                width={285}
                height={285}
                priority
                sizes="(min-width: 1024px) 320px, 300px"
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick links overlapping the hero */}
      <section aria-labelledby="quick-links" className="container-page relative z-10 -mt-20">
        <div className="border-line shadow-card rounded-2xl border bg-white p-4 sm:p-6">
          <h2
            id="quick-links"
            className="text-muted px-1 font-sans text-sm font-bold tracking-wider uppercase"
          >
            {t.quickLinksHeading}
          </h2>
          <ul className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
            {quickLinks.map((slug) => {
              const Icon = pageIcons[slug];
              return (
                <li key={slug}>
                  <Link
                    href={pagePath(locale, slug)}
                    className="text-navy-900 hover:bg-navy-50 flex h-full min-h-20 flex-col items-start gap-2 rounded-xl p-3 text-[15px] leading-snug font-semibold transition-colors"
                  >
                    <Icon aria-hidden="true" size={22} className="text-crimson-800" />
                    {dict.nav[pageNavKey[slug]]}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* About intro */}
      <section className="container-page grid gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="eyebrow">{t.introEyebrow}</p>
          <h2 className="text-navy-900 mt-3 text-3xl font-bold sm:text-4xl">{t.introTitle}</h2>
          <div className="prose-school text-muted mt-5 text-lg leading-relaxed">
            <p>{t.introBody}</p>
            <p>{t.introBody2}</p>
          </div>
          <ButtonLink href={pagePath(locale, "about")} variant="secondary" className="mt-7">
            {t.introCta}
            <ArrowRight aria-hidden="true" size={18} />
          </ButtonLink>
        </div>
        <dl className="grid gap-4 sm:grid-cols-2">
          {[
            [dict.about.factLevel, dict.about.factLevelValue],
            [dict.about.factMedium, dict.about.factMediumValue],
            [dict.about.factLocation, dict.school.place],
            [dict.about.factMotto, `“${dict.school.motto}”`],
          ].map(([term, value]) => (
            <div
              key={term}
              className="border-gold-500 shadow-card rounded-xl border-l-4 bg-white p-5"
            >
              <dt className="text-muted text-sm font-semibold tracking-wide uppercase">{term}</dt>
              <dd className="font-display text-navy-900 mt-1.5 text-xl font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Achievements */}
      <section
        aria-labelledby="home-achievements"
        className="border-line border-y bg-white py-16 sm:py-20"
      >
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_minmax(0,420px)] lg:items-start">
          <div>
            <p className="eyebrow">{t.achievementsEyebrow}</p>
            <h2
              id="home-achievements"
              className="text-navy-900 mt-3 text-3xl font-bold sm:text-4xl"
            >
              {t.achievementsTitle}
            </h2>
            <p className="text-muted mt-5 text-lg leading-relaxed">{t.achievementsBody}</p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {judoResults2026.map((row) => (
                <li
                  key={row.student}
                  className="bg-paper ring-line flex items-center gap-3 rounded-xl p-4 ring-1"
                >
                  <Medal
                    aria-hidden="true"
                    size={26}
                    className={`shrink-0 ${medalTone[row.result]}`}
                  />
                  <span>
                    <span className="text-navy-900 block font-semibold" lang="en">
                      {row.student}
                    </span>
                    <span className="text-muted block text-sm">
                      {dict.achievementsData[row.result]} ·{" "}
                      {format(dict.achievementsData.under, { age: row.ageGroup })} (−
                      {row.weightKg} kg)
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <ButtonLink href={pagePath(locale, "achievements")} className="mt-8">
              {t.achievementsCta}
              <ArrowRight aria-hidden="true" size={18} />
            </ButtonLink>
          </div>
          <PosterViewer
            sizes="(min-width: 1024px) 420px, (min-width: 640px) 560px, 92vw"
            className="mx-auto w-full max-w-[560px] lg:max-w-none"
            labels={{ ...dict.poster, newTab: dict.common.opensInNewTab }}
          />
        </div>
      </section>

      {/* Rules & resources */}
      <section aria-labelledby="home-resources" className="container-page py-16 sm:py-20">
        <div className="max-w-3xl">
          <p className="eyebrow">{t.resourcesEyebrow}</p>
          <h2 id="home-resources" className="text-navy-900 mt-3 text-3xl font-bold sm:text-4xl">
            {t.resourcesTitle}
          </h2>
          <p className="text-muted mt-4 text-lg">{t.resourcesBody}</p>
        </div>
        <div className="mt-8">
          <ResourceCards locale={locale} dict={dict} />
        </div>
      </section>

      {/* Gallery teaser */}
      <section aria-labelledby="home-gallery" className="container-page pb-16 sm:pb-20">
        <div className="bg-navy-50 grid gap-6 rounded-2xl p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="eyebrow">{t.galleryEyebrow}</p>
            <h2 id="home-gallery" className="text-navy-900 mt-2 text-2xl font-bold sm:text-3xl">
              {t.galleryTitle}
            </h2>
            <p className="text-muted mt-3 max-w-2xl">{t.galleryBody}</p>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {mapsPhotoCollections.map((href, index) => (
                <li key={href}>
                  <ExternalLink
                    href={href}
                    newTabLabel={dict.common.opensInNewTab}
                    className="text-navy-800 hover:text-crimson-800 inline-flex items-center font-semibold underline underline-offset-4"
                  >
                    {index === 0 ? dict.gallery.mapsLink1 : dict.gallery.mapsLink2}
                  </ExternalLink>
                </li>
              ))}
            </ul>
          </div>
          <ButtonLink href={pagePath(locale, "gallery")} variant="secondary">
            {t.galleryCta}
          </ButtonLink>
        </div>
      </section>

      {/* Enquiry CTA */}
      <section aria-labelledby="home-enquiry" className="bg-crimson-800 text-white">
        <div className="container-page flex flex-col gap-6 py-12 sm:py-14 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 id="home-enquiry" className="text-3xl font-bold">
              {t.enquiryTitle}
            </h2>
            <p className="mt-3 text-lg text-white/85">{t.enquiryBody}</p>
          </div>
          <ButtonLink
            href={pagePath(locale, "admission")}
            variant="onDark"
            className="self-start lg:self-auto"
          >
            {t.enquiryCta}
            <ArrowRight aria-hidden="true" size={18} />
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
