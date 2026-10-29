import { resolveLocale } from "@/lib/page";
import { metadataFor } from "@/lib/metadata";
import { DocumentPage } from "@/components/layout/DocumentPage";

export const generateMetadata = metadataFor("teachers", "teachers");

export default async function TeachersPage({ params }: PageProps<"/[locale]/teachers">) {
  const { locale, dict } = await resolveLocale(params);
  return (
    <DocumentPage
      locale={locale}
      dict={dict}
      slug="teachers"
      title={dict.teachers.title}
      lead={dict.teachers.lead}
    />
  );
}
