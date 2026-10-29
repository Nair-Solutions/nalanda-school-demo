import { resolveLocale } from "@/lib/page";
import { metadataFor } from "@/lib/metadata";
import { DocumentPage } from "@/components/layout/DocumentPage";

export const generateMetadata = metadataFor("academic-calendar", "academicCalendar");

export default async function AcademicCalendarPage({
  params,
}: PageProps<"/[locale]/academic-calendar">) {
  const { locale, dict } = await resolveLocale(params);
  return (
    <DocumentPage
      locale={locale}
      dict={dict}
      slug="academic-calendar"
      title={dict.academicCalendar.title}
      lead={dict.academicCalendar.lead}
    />
  );
}
