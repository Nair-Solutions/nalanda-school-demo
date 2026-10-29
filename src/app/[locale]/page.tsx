import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Medal } from "lucide-react";
import type { Metadata } from "next";
import { resolveLocale } from "@/lib/page";
import { pageMetadata } from "@/lib/metadata";
import { format } from "@/i18n/get-dictionary";
import { htmlLang } from "@/i18n/config";
import { pagePath } from "@/content/routes";
import { judoResults2026 } from "@/content/achievements";
import { mapsPhotoCollections } from "@/content/school";
import { heroImage } from "@/content/hero";
import { notices } from "@/content/notices";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { ResourceList } from "@/components/ui/ResourceList";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { PosterViewer } from "@/components/achievements/PosterViewer";
import { CallbackForm } from "@/components/forms/CallbackForm";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale, dict } = await resolveLocale(params);
  return pageMetadata({ locale, slug: "", title: dict.home.metaTitle });
}

const medalTone = {
  gold: "text-[#b8860b]",
  silver: "text-slate-500",
  medal: "text-[#a0612b]",
} as const;

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale, dict } = await resolveLocale(params);
  const t = dict.home;
  // "Nalanda" at display size, the rest of the official name beneath it (as on the logo).
  const [nameFirst = "", ...rest] = dict.school.name.split(" ");
  const nameRest = rest.join(" ");
  const dateFormat = new Intl.DateTimeFormat(htmlLang[locale], { dateStyle: "medium" });

  return (
    <>
      {/* Hero: the name, one sentence, and the working action. */}
      <section className="container-page grid gap-10 pt-8 pb-16 sm:pt-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-14 lg:pt-16 lg:pb-24">
        <div>
          <h1 className="text-navy-900">
            <span className="text-display block">{nameFirst}</span>
            <span className="text-heading mt-2 block">{nameRest}</span>
          </h1>
          <p className="measure text-body text-ink mt-6 sm:text-xl">{t.heroLead}</p>
          <p className="font-display text-crimson-800 mt-3 text-lg sm:text-xl" lang="en">
            “{dict.school.motto}”
          </p>
          <div className="mt-8 max-w-2xl">
            <CallbackForm
              locale={locale}
              t={dict.form}
              copy={{
                callbackHeading: t.callbackHeading,
                callbackBody: t.callbackBody,
                callbackSubmit: t.callbackSubmit,
                callbackSuccessTitle: t.callbackSuccessTitle,
              }}
            />
          </div>
        </div>
        <figure data-testid="hero-figure">
          {heroImage ? (
            <>
              <div className="hero-reveal relative aspect-[4/5] overflow-hidden rounded-[4px]">
                <Image
                  src={heroImage.src}
                  alt={heroImage.alt[locale]}
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="text-muted mt-3 text-sm">
                {heroImage.caption?.[locale]}
                {heroImage.credit && (
                  <>
                    {" · "}
                    <a
                      href={heroImage.credit.sourceUrl}
                      className="underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {format(dict.viewer.credit, {
                        credit: `${heroImage.credit.text}, ${heroImage.credit.licence}`,
                      })}
                    </a>
                  </>
                )}
              </figcaption>
            </>
          ) : (
            <>
              <div className="hero-reveal bg-navy-900 flex aspect-[16/10] max-h-[38rem] items-center justify-center rounded-3xl p-6 sm:aspect-[4/5] sm:p-14">
                <div className="aspect-square h-full max-h-[22rem] overflow-hidden rounded-full bg-white p-[14%] sm:h-auto sm:w-full sm:max-w-[22rem]">
                  <Image
                    src="/branding/nalanda-emblem.png"
                    alt=""
                    width={285}
                    height={285}
                    priority
                    sizes="(min-width: 1024px) 300px, 70vw"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
              <figcaption className="text-muted mt-3 text-sm">{t.heroImageFallback}</figcaption>
            </>
          )}
        </figure>
      </section>

      {/* Notices: only when the school has published some. */}
      {notices.length > 0 && (
        <section aria-labelledby="home-notices" className="bg-gold-100/60">
          <div className="container-page py-10" data-reveal>
            <h2 id="home-notices" className="text-title text-navy-900">
              {t.noticesTitle}
            </h2>
            <ul className="mt-4 grid gap-2">
              {notices.slice(0, 4).map((notice) => (
                <li key={notice.id} className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <time dateTime={notice.date} className="text-muted text-sm font-semibold">
                    {dateFormat.format(new Date(notice.date))}
                  </time>
                  {notice.href ? (
                    <Link
                      href={notice.href}
                      className="text-body text-navy-900 font-semibold underline"
                    >
                      {notice.title[locale]}
                    </Link>
                  ) : (
                    <span className="text-body text-navy-900 font-semibold">
                      {notice.title[locale]}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Documents families look up most. */}
      <section aria-labelledby="home-documents" className="section-y bg-navy-50">
        <div className="container-page" data-reveal>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 id="home-documents" className="text-heading text-navy-900">
                {t.documentsTitle}
              </h2>
              <p className="measure text-body text-ink mt-4">{t.documentsBody}</p>
            </div>
            <Link
              href={pagePath(locale, "rules-and-regulations")}
              className="text-navy-800 inline-flex items-center gap-1.5 font-semibold underline"
            >
              {dict.nav.rules}
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
          </div>
          <div className="mt-10">
            <ResourceList locale={locale} dict={dict} />
          </div>
        </div>
      </section>

      {/* The name: Nalanda (design option A). */}
      <section aria-labelledby="home-name" className="section-y bg-navy-900 text-white">
        <div className="container-page grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16" data-reveal>
          <div>
            <h2 id="home-name" className="text-heading">
              {t.nameTitle}
            </h2>
            <div className="measure text-body mt-6 space-y-4 text-white/85">
              <p>{t.nameBody}</p>
              <p>{t.nameBody2}</p>
            </div>
            <ButtonLink href={pagePath(locale, "about")} variant="outlineOnDark" className="mt-8">
              {dict.about.title}
              <ArrowRight aria-hidden="true" size={18} />
            </ButtonLink>
          </div>
          <dl className="grid content-start gap-2 sm:grid-cols-2">
            {[
              [dict.about.factLevel, dict.about.factLevelValue],
              [dict.about.factMedium, dict.about.factMediumValue],
              [dict.about.factLocation, dict.school.place],
              [dict.about.factMotto, `“${dict.school.motto}”`],
            ].map(([term, value]) => (
              <div key={term} className="bg-navy-800 rounded-2xl p-6">
                <dt className="text-base text-white/75">{term}</dt>
                <dd className="font-display mt-2 text-xl font-bold text-white">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Achievements: the poster leads. */}
      <section aria-labelledby="home-achievements" className="section-y">
        <div
          className="container-page grid gap-12 lg:grid-cols-[1fr_minmax(0,440px)] lg:items-start"
          data-reveal
        >
          <div>
            <h2 id="home-achievements" className="text-heading text-navy-900">
              {t.achievementsTitle}
            </h2>
            <p className="measure text-body text-ink mt-5">{t.achievementsBody}</p>
            <ul className="mt-8 grid gap-2 sm:grid-cols-2">
              {judoResults2026.map((row) => (
                <li key={row.student} className="flex items-center gap-3 rounded-2xl bg-white p-4">
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
            <ButtonLink href={pagePath(locale, "achievements")} className="mt-10">
              {t.achievementsCta}
              <ArrowRight aria-hidden="true" size={18} />
            </ButtonLink>
          </div>
          <PosterViewer
            sizes="(min-width: 1024px) 440px, (min-width: 640px) 560px, 92vw"
            className="mx-auto w-full max-w-[560px] lg:max-w-none"
            labels={{ ...dict.poster, newTab: dict.common.opensInNewTab }}
          />
        </div>
      </section>

      {/* See the school. */}
      <section aria-labelledby="home-gallery" className="section-y bg-white">
        <div className="container-page grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end" data-reveal>
          <div>
            <h2 id="home-gallery" className="text-heading text-navy-900">
              {t.galleryTitle}
            </h2>
            <p className="measure text-body text-ink mt-4">{t.galleryBody}</p>
            <ul className="mt-6 flex flex-col gap-2 sm:flex-row sm:gap-8">
              {mapsPhotoCollections.map((href, index) => (
                <li key={href}>
                  <ExternalLink
                    href={href}
                    newTabLabel={dict.common.opensInNewTab}
                    className="text-navy-800 hover:text-crimson-800 inline-flex min-h-11 items-center font-semibold underline"
                  >
                    {index === 0 ? dict.gallery.mapsLink1 : dict.gallery.mapsLink2}
                  </ExternalLink>
                </li>
              ))}
            </ul>
          </div>
          <ButtonLink href={pagePath(locale, "gallery")} variant="secondary">
            {t.galleryCta}
            <ArrowRight aria-hidden="true" size={18} />
          </ButtonLink>
        </div>
      </section>

      <RevealObserver />
    </>
  );
}
