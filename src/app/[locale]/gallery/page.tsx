import { Images } from "lucide-react";
import { resolveLocale } from "@/lib/page";
import { metadataFor } from "@/lib/metadata";
import { mapsPhotoCollections } from "@/content/school";
import { galleryItems, hasSchoolPhotos } from "@/content/gallery";
import { PageHeader } from "@/components/layout/PageHeader";
import { PendingNotice } from "@/components/ui/PendingNotice";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { GalleryViewer } from "@/components/gallery/GalleryViewer";

export const generateMetadata = metadataFor("gallery", "gallery");

export default async function GalleryPage({ params }: PageProps<"/[locale]/gallery">) {
  const { locale, dict } = await resolveLocale(params);
  const t = dict.gallery;
  return (
    <>
      <PageHeader locale={locale} dict={dict} slug="gallery" title={t.title} lead={t.lead} />
      <div className="container-page grid gap-14 py-12 sm:py-16">
        {!hasSchoolPhotos && <PendingNotice dict={dict} locale={locale} showCta={false} />}

        <section aria-labelledby="featured">
          <h2 id="featured" className="text-heading text-navy-900">
            {t.featuredHeading}
          </h2>
          <div className="mt-8 max-w-3xl">
            <GalleryViewer
              items={galleryItems}
              locale={locale}
              t={dict.viewer}
              newTabLabel={dict.common.opensInNewTab}
            />
          </div>
        </section>

        <section aria-labelledby="maps-photos" className="bg-navy-50 rounded-3xl p-6 sm:p-10">
          <h2 id="maps-photos" className="text-heading text-navy-900 flex items-center gap-3">
            <Images aria-hidden="true" className="text-crimson-800 shrink-0" size={32} />
            {t.mapsHeading}
          </h2>
          <p className="measure text-body text-ink mt-4">{t.mapsBody}</p>
          <ul className="mt-6 flex flex-col gap-2 sm:flex-row sm:gap-8">
            {mapsPhotoCollections.map((href, index) => (
              <li key={href}>
                <ExternalLink
                  href={href}
                  newTabLabel={dict.common.opensInNewTab}
                  className="text-navy-800 hover:text-crimson-800 inline-flex min-h-11 items-center font-semibold underline"
                >
                  {index === 0 ? t.mapsLink1 : t.mapsLink2}
                </ExternalLink>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
