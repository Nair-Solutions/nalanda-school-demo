import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { resolveLocale } from "@/lib/page";
import { metadataFor } from "@/lib/metadata";
import { pageNavKey, pagePath, type PageSlug } from "@/content/routes";
import { PageHeader } from "@/components/layout/PageHeader";
import { PendingNotice } from "@/components/ui/PendingNotice";

export const generateMetadata = metadataFor("about", "about");

const related = [
  "academics",
  "facilities",
  "achievements",
  "rules-and-regulations",
] as const satisfies readonly PageSlug[];

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale, dict } = await resolveLocale(params);
  const t = dict.about;
  const facts: [string, string, boolean?][] = [
    [t.factName, dict.school.name],
    [t.factLocation, dict.school.place],
    [t.factLevel, t.factLevelValue],
    [t.factMedium, t.factMediumValue],
    [t.factMotto, `“${dict.school.motto}”`, true],
  ];

  return (
    <>
      <PageHeader locale={locale} dict={dict} slug="about" title={t.title} lead={t.lead} />
      <section
        aria-labelledby="about-glance"
        className="container-page grid gap-12 py-12 sm:py-16 lg:grid-cols-2 lg:gap-20"
      >
        <div>
          <h2 id="about-glance" className="text-heading text-navy-900">
            {t.identityHeading}
          </h2>
          <dl className="mt-8 grid gap-2">
            {facts.map(([term, value, english]) => (
              <div
                key={term}
                className="grid gap-1 rounded-2xl bg-white p-5 sm:grid-cols-[11rem_1fr] sm:gap-6"
              >
                <dt className="text-muted text-base">{term}</dt>
                <dd className="text-title text-navy-900" lang={english ? "en" : undefined}>
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <h2 className="text-heading text-navy-900">{t.emblemHeading}</h2>
          <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-start">
            <div className="h-44 w-44 shrink-0 rounded-full bg-white p-5">
              <Image
                src="/branding/nalanda-emblem.png"
                alt=""
                width={285}
                height={285}
                sizes="176px"
                className="h-full w-full object-contain"
              />
            </div>
            <p className="measure text-body text-ink">{t.emblemBody}</p>
          </div>
        </div>
      </section>

      <section className="bg-navy-50">
        <div className="container-page grid gap-12 py-12 sm:py-16">
          <PendingNotice
            dict={dict}
            locale={locale}
            heading={t.storyHeading}
            detail={t.storyBody}
          />
          <div>
            <h2 className="text-heading text-navy-900">{t.linksHeading}</h2>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((slug) => (
                <li key={slug}>
                  <Link
                    href={pagePath(locale, slug)}
                    className="text-title text-navy-900 flex min-h-16 items-center justify-between gap-3 rounded-2xl bg-white p-5 hover:underline"
                  >
                    {dict.nav[pageNavKey[slug]]}
                    <ArrowRight
                      aria-hidden="true"
                      size={20}
                      className="text-crimson-800 shrink-0"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
