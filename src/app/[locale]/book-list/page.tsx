import { resolveLocale } from "@/lib/page";
import { metadataFor } from "@/lib/metadata";
import { DocumentPage } from "@/components/layout/DocumentPage";

export const generateMetadata = metadataFor("book-list", "bookList");

export default async function BookListPage({ params }: PageProps<"/[locale]/book-list">) {
  const { locale, dict } = await resolveLocale(params);
  return (
    <DocumentPage
      locale={locale}
      dict={dict}
      slug="book-list"
      title={dict.bookList.title}
      lead={dict.bookList.lead}
    />
  );
}
