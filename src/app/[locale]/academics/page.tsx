import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { resolveLocale } from "@/lib/page";
import { metadataFor } from "@/lib/metadata";
import { pagePath } from "@/content/routes";
import { PageHeader } from "@/components/layout/PageHeader";
import { PendingNotice } from "@/components/ui/PendingNotice";

export const generateMetadata = metadataFor("academics", "academics");

export default async function AcademicsPage({ params }: PageProps<"/[locale]/academics">) {
  const { locale, dict } = await resolveLocale(params);
  const t = dict.academics;
  const rows = [
    { heading: t.mediumHeading, body: t.mediumBody },
    { heading: t.levelsHeading, body: t.levelsBody },
    {
      heading: t.cbseHeading,
      body: t.cbseBody,
      link: { href: pagePath(locale, "achievements"), label: dict.nav.achievements },
    },
  ];

  return (
    <>
      <PageHeader locale={locale} dict={dict} slug="academics" title={t.title} lead={t.lead} />
      <div className="container-page grid gap-12 py-12 sm:py-16">
        <div className="grid gap-x-12 gap-y-10 lg:grid-cols-3">
          {rows.map(({ heading, body, link }) => (
            <section key={heading}>
              <h2 className="text-heading text-navy-900">{heading}</h2>
              <p className="text-body text-ink mt-4">{body}</p>
              {link && (
                <Link
                  href={link.href}
                  className="text-navy-800 mt-4 inline-flex items-center gap-1.5 font-semibold underline"
                >
                  {link.label}
                  <ArrowRight aria-hidden="true" size={18} />
                </Link>
              )}
            </section>
          ))}
        </div>

        <PendingNotice
          dict={dict}
          locale={locale}
          heading={t.streamsHeading}
          detail={t.streamsBody}
        />

        <section aria-labelledby="academic-resources">
          <h2 id="academic-resources" className="text-heading text-navy-900">
            {t.resourcesHeading}
          </h2>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {[
              {
                slug: "academic-calendar" as const,
                label: dict.nav.academicCalendar,
                desc: dict.rules.academicCalendarDesc,
              },
              {
                slug: "book-list" as const,
                label: dict.nav.bookList,
                desc: dict.rules.bookListDesc,
              },
            ].map(({ slug, label, desc }) => (
              <li key={slug}>
                <Link
                  href={pagePath(locale, slug)}
                  className="group hover:bg-navy-50 flex h-full items-start justify-between gap-4 rounded-2xl bg-white p-6"
                >
                  <span>
                    <span className="text-title text-navy-900 block group-hover:underline">
                      {label}
                    </span>
                    <span className="text-ink mt-1 block text-base">{desc}</span>
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    size={22}
                    className="text-crimson-800 mt-1 shrink-0"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
