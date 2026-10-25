import Link from "next/link";
import { BookOpen, CalendarDays, Languages, Layers, Trophy } from "lucide-react";
import { resolveLocale } from "@/lib/page";
import { metadataFor } from "@/lib/metadata";
import { pagePath } from "@/content/routes";
import { PageHeader } from "@/components/layout/PageHeader";
import { PendingNotice } from "@/components/ui/PendingNotice";

export const generateMetadata = metadataFor("academics", "academics");

export default async function AcademicsPage({ params }: PageProps<"/[locale]/academics">) {
  const { locale, dict } = await resolveLocale(params);
  const t = dict.academics;
  const cards = [
    { icon: Languages, heading: t.mediumHeading, body: t.mediumBody },
    { icon: Layers, heading: t.levelsHeading, body: t.levelsBody },
    {
      icon: Trophy,
      heading: t.cbseHeading,
      body: t.cbseBody,
      link: { href: pagePath(locale, "achievements"), label: dict.nav.achievements },
    },
  ];

  return (
    <>
      <PageHeader locale={locale} dict={dict} slug="academics" title={t.title} lead={t.lead} />
      <div className="container-page grid gap-12 py-12 sm:py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {cards.map(({ icon: Icon, heading, body, link }) => (
            <section
              key={heading}
              className="border-line shadow-card rounded-xl border bg-white p-6"
            >
              <Icon aria-hidden="true" className="text-crimson-800" size={28} />
              <h2 className="text-navy-900 mt-4 text-xl font-bold">{heading}</h2>
              <p className="text-muted mt-2">{body}</p>
              {link && (
                <Link
                  href={link.href}
                  className="text-navy-800 mt-4 inline-block font-semibold underline underline-offset-4"
                >
                  {link.label}
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
          <h2 id="academic-resources" className="text-navy-900 text-2xl font-bold">
            {t.resourcesHeading}
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              {
                slug: "academic-calendar" as const,
                icon: CalendarDays,
                label: dict.nav.academicCalendar,
                desc: dict.rules.academicCalendarDesc,
              },
              {
                slug: "book-list" as const,
                icon: BookOpen,
                label: dict.nav.bookList,
                desc: dict.rules.bookListDesc,
              },
            ].map(({ slug, icon: Icon, label, desc }) => (
              <li key={slug}>
                <Link
                  href={pagePath(locale, slug)}
                  className="border-line hover:border-navy-800/40 flex h-full items-start gap-4 rounded-xl border bg-white p-5"
                >
                  <Icon aria-hidden="true" className="text-navy-800 mt-0.5 shrink-0" />
                  <span>
                    <span className="text-navy-900 block font-semibold">{label}</span>
                    <span className="text-muted mt-1 block text-[15px]">{desc}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
