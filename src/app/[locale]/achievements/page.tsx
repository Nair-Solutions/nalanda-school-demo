import { MapPin } from "lucide-react";
import { resolveLocale } from "@/lib/page";
import { metadataFor } from "@/lib/metadata";
import { PageHeader } from "@/components/layout/PageHeader";
import { PosterViewer } from "@/components/achievements/PosterViewer";
import { ResultsTable } from "@/components/achievements/ResultsTable";

export const generateMetadata = metadataFor("achievements", "achievements");

export default async function AchievementsPage({ params }: PageProps<"/[locale]/achievements">) {
  const { locale, dict } = await resolveLocale(params);
  const t = dict.achievements;
  return (
    <>
      <PageHeader locale={locale} dict={dict} slug="achievements" title={t.title} lead={t.lead} />
      <div className="container-page grid gap-14 py-12 sm:py-16">
        <section
          aria-labelledby="judo-2026"
          className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)] lg:items-start"
        >
          <div>
            <h2 id="judo-2026" className="text-heading text-navy-900">
              {t.eventHeading}
            </h2>
            <p className="text-body text-ink mt-4 flex items-start gap-2">
              <MapPin aria-hidden="true" size={20} className="text-crimson-800 mt-1 shrink-0" />
              <span>
                <span className="font-semibold">{t.eventVenueLabel}:</span>{" "}
                {dict.achievementsData.venue}
              </span>
            </p>
            <p className="measure text-body text-ink mt-4">{t.eventBody}</p>
            <div className="mt-8">
              <ResultsTable dict={dict} />
            </div>
          </div>
          <PosterViewer
            priority
            sizes="(min-width: 1024px) 480px, (min-width: 640px) 600px, 92vw"
            className="mx-auto w-full max-w-[600px] lg:max-w-none"
            labels={{ ...dict.poster, newTab: dict.common.opensInNewTab }}
          />
        </section>
        <section aria-labelledby="more-achievements" className="bg-navy-50 rounded-2xl p-6 sm:p-8">
          <h2 id="more-achievements" className="text-title text-navy-900">
            {t.moreHeading}
          </h2>
          <p className="text-body text-ink mt-2">{t.moreBody}</p>
        </section>
      </div>
    </>
  );
}
