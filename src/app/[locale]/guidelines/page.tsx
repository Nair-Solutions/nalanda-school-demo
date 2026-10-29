import { resolveLocale } from "@/lib/page";
import { metadataFor } from "@/lib/metadata";
import { legacyGuidelinesUrl } from "@/content/school";
import { DocumentPage } from "@/components/layout/DocumentPage";
import { ExternalLink } from "@/components/ui/ExternalLink";

export const generateMetadata = metadataFor("guidelines", "guidelines");

export default async function GuidelinesPage({ params }: PageProps<"/[locale]/guidelines">) {
  const { locale, dict } = await resolveLocale(params);
  const t = dict.guidelines;
  return (
    <DocumentPage locale={locale} dict={dict} slug="guidelines" title={t.title} lead={t.lead}>
      <section aria-labelledby="legacy-guidelines" className="rounded-2xl bg-white p-6">
        <h2 id="legacy-guidelines" className="text-title text-navy-900">
          {t.legacyHeading}
        </h2>
        <p className="text-body text-ink mt-2">{t.legacyBody}</p>
        <ExternalLink
          href={legacyGuidelinesUrl}
          newTabLabel={dict.common.opensInNewTab}
          className="text-navy-800 hover:text-crimson-800 mt-4 inline-flex items-center font-semibold underline underline-offset-4"
        >
          {t.legacyLink}
        </ExternalLink>
      </section>
    </DocumentPage>
  );
}
