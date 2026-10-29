import { resolveLocale } from "@/lib/page";
import { metadataFor } from "@/lib/metadata";
import { DocumentPage } from "@/components/layout/DocumentPage";

export const generateMetadata = metadataFor("public-disclosure", "publicDisclosure");

export default async function PublicDisclosurePage({
  params,
}: PageProps<"/[locale]/public-disclosure">) {
  const { locale, dict } = await resolveLocale(params);
  const t = dict.publicDisclosure;
  const sections = [
    t.sectionGeneral,
    t.sectionDocuments,
    t.sectionResults,
    t.sectionStaff,
    t.sectionInfrastructure,
  ];
  return (
    <DocumentPage
      locale={locale}
      dict={dict}
      slug="public-disclosure"
      title={t.title}
      lead={t.lead}
    >
      <section aria-labelledby="disclosure-sections">
        <h2 id="disclosure-sections" className="text-heading text-navy-900">
          {t.sectionsHeading}
        </h2>
        <ol className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((label, index) => (
            <li key={label} className="flex items-baseline gap-3 rounded-2xl bg-white p-5">
              <span className="font-display text-crimson-800 text-xl font-bold">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="text-title text-navy-900">{label}</span>
            </li>
          ))}
        </ol>
      </section>
    </DocumentPage>
  );
}
