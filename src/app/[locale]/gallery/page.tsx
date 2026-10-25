import { Images } from "lucide-react";
import { resolveLocale } from "@/lib/page";
import { metadataFor } from "@/lib/metadata";
import { mapsPhotoCollections } from "@/content/school";
import { PageHeader } from "@/components/layout/PageHeader";
import { PendingNotice } from "@/components/ui/PendingNotice";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { PosterViewer } from "@/components/achievements/PosterViewer";

export const generateMetadata = metadataFor("gallery", "gallery");

export default async function GalleryPage({ params }: PageProps<"/[locale]/gallery">) {
  const { locale, dict } = await resolveLocale(params);
  const t = dict.gallery;
  return (
    <>
      <PageHeader locale={locale} dict={dict} slug="gallery" title={t.title} lead={t.lead} />
      <div className="container-page grid gap-12 py-12 sm:py-16">
        <PendingNotice dict={dict} locale={locale} showCta={false} />

        <section aria-labelledby="maps-photos" className="bg-navy-50 rounded-2xl p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <Images aria-hidden="true" className="text-navy-800 mt-1 shrink-0" size={28} />
            <div>
              <h2 id="maps-photos" className="text-navy-900 text-2xl font-bold">
                {t.mapsHeading}
              </h2>
              <p className="text-muted mt-2">{t.mapsBody}</p>
              <ul className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-6">
                {mapsPhotoCollections.map((href, index) => (
                  <li key={href}>
                    <ExternalLink
                      href={href}
                      newTabLabel={dict.common.opensInNewTab}
                      className="text-navy-800 hover:text-crimson-800 inline-flex min-h-11 items-center font-semibold underline underline-offset-4"
                    >
                      {index === 0 ? t.mapsLink1 : t.mapsLink2}
                    </ExternalLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section aria-labelledby="featured">
          <h2 id="featured" className="text-navy-900 text-2xl font-bold">
            {t.featuredHeading}
          </h2>
          <PosterViewer
            sizes="(min-width: 640px) 420px, 92vw"
            className="mt-5 w-full max-w-[420px]"
            labels={{ ...dict.poster, newTab: dict.common.opensInNewTab }}
          />
        </section>
      </div>
    </>
  );
}
