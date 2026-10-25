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
      <div className="container-page grid gap-12 py-12 sm:py-16">
        <section aria-labelledby="about-glance" className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 id="about-glance" className="text-navy-900 text-2xl font-bold sm:text-3xl">
              {t.identityHeading}
            </h2>
            <dl className="divide-line border-line mt-5 divide-y rounded-xl border bg-white">
              {facts.map(([term, value, english]) => (
                <div key={term} className="grid gap-1 p-4 sm:grid-cols-[180px_1fr] sm:gap-4">
                  <dt className="text-muted font-semibold">{term}</dt>
                  <dd className="text-navy-900 font-semibold" lang={english ? "en" : undefined}>
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="bg-navy-50 rounded-2xl p-6 sm:p-8">
            <h2 className="text-navy-900 text-2xl font-bold sm:text-3xl">{t.emblemHeading}</h2>
            <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <Image
                src="/branding/nalanda-emblem.png"
                alt=""
                width={285}
                height={285}
                sizes="160px"
                className="shadow-card h-40 w-40 shrink-0 rounded-full bg-white p-3"
              />
              <p className="text-muted text-lg leading-relaxed">{t.emblemBody}</p>
            </div>
          </div>
        </section>

        <PendingNotice dict={dict} locale={locale} heading={t.storyHeading} detail={t.storyBody} />

        <section aria-labelledby="about-more">
          <h2 id="about-more" className="text-navy-900 text-2xl font-bold">
            {t.linksHeading}
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((slug) => (
              <li key={slug}>
                <Link
                  href={pagePath(locale, slug)}
                  className="border-line text-navy-900 hover:border-navy-800/40 flex items-center justify-between rounded-xl border bg-white p-4 font-semibold"
                >
                  {dict.nav[pageNavKey[slug]]}
                  <ArrowRight aria-hidden="true" size={18} className="text-crimson-800" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
