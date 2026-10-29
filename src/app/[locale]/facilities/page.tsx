import Image from "next/image";
import { resolveLocale } from "@/lib/page";
import { metadataFor } from "@/lib/metadata";
import { facilities } from "@/content/facilities";
import { PageHeader } from "@/components/layout/PageHeader";
import { PendingNotice } from "@/components/ui/PendingNotice";

export const generateMetadata = metadataFor("facilities", "facilities");

export default async function FacilitiesPage({ params }: PageProps<"/[locale]/facilities">) {
  const { locale, dict } = await resolveLocale(params);
  const t = dict.facilities;
  return (
    <>
      <PageHeader locale={locale} dict={dict} slug="facilities" title={t.title} lead={t.lead} />
      <div className="container-page py-12 sm:py-16">
        {facilities.length > 0 ? (
          <ul className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {facilities.map((facility) => (
              <li key={facility.id}>
                <Image
                  src={facility.photo.src}
                  alt={facility.photo.alt[locale]}
                  width={facility.photo.width}
                  height={facility.photo.height}
                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 92vw"
                  className="aspect-[4/3] w-full rounded-[4px] object-cover"
                />
                <h2 className="text-title text-navy-900 mt-4">{facility.name[locale]}</h2>
                <p className="text-body text-ink mt-1">{facility.description[locale]}</p>
              </li>
            ))}
          </ul>
        ) : (
          <PendingNotice dict={dict} locale={locale} detail={t.askBody} />
        )}
      </div>
    </>
  );
}
