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
      <div className="container-page grid gap-12 py-12 sm:py-16">
        <section
          aria-labelledby="judo-2026"
          className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)] lg:items-start"
        >
          <div>
            <p className="eyebrow">2026</p>
            <h2 id="judo-2026" className="text-navy-900 mt-2 text-2xl font-bold sm:text-3xl">
              {t.eventHeading}
            </h2>
            <p className="text-muted mt-3 flex items-start gap-2">
              <MapPin aria-hidden="true" size={18} className="text-crimson-800 mt-1 shrink-0" />
              <span>
                <span className="text-ink font-semibold">{t.eventVenueLabel}:</span>{" "}
                {dict.achievementsData.venue}
              </span>
            </p>
            <p className="text-muted mt-4 text-lg leading-relaxed">{t.eventBody}</p>
            <div className="mt-6">
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
        <section
          aria-labelledby="more-achievements"
          className="border-line rounded-xl border border-dashed p-6"
        >
          <h2 id="more-achievements" className="text-navy-900 text-xl font-bold">
            {t.moreHeading}
          </h2>
          <p className="text-muted mt-2">{t.moreBody}</p>
        </section>
      </div>
    </>
  );
}
