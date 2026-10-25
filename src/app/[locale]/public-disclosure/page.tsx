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
        <h2 id="disclosure-sections" className="text-navy-900 text-2xl font-bold">
          {t.sectionsHeading}
        </h2>
        <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((label, index) => (
            <li
              key={label}
              className="border-line flex items-center gap-3 rounded-xl border bg-white p-4"
            >
              <span className="bg-navy-800 flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-semibold text-white">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="text-navy-900 font-semibold">{label}</span>
            </li>
          ))}
        </ol>
      </section>
    </DocumentPage>
  );
}
