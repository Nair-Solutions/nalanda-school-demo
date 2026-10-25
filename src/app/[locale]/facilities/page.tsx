import { resolveLocale } from "@/lib/page";
import { metadataFor } from "@/lib/metadata";
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
        <PendingNotice dict={dict} locale={locale} detail={t.askBody} />
      </div>
    </>
  );
}
