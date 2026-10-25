import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { PageSlug } from "@/content/routes";
import { documentsFor } from "@/content/documents";
import { PageHeader } from "./PageHeader";
import { DocumentList } from "@/components/ui/DocumentList";
import { PendingNotice } from "@/components/ui/PendingNotice";
import { ResourceCards } from "@/components/ui/ResourceCards";
import type { ReactNode } from "react";

interface Props {
  locale: Locale;
  dict: Dictionary;
  slug: PageSlug;
  title: string;
  lead: string;
  children?: ReactNode;
}

/** Layout for a Rules & Regulations sub-page: documents when published, otherwise an honest pending state. */
export function DocumentPage({ locale, dict, slug, title, lead, children }: Props) {
  const hasDocs = documentsFor(slug).some((doc) => doc.file);
  return (
    <>
      <PageHeader
        locale={locale}
        dict={dict}
        slug={slug}
        title={title}
        lead={lead}
        parent="rules-and-regulations"
      />
      <div className="container-page grid gap-10 py-12 sm:py-16">
        {hasDocs ? (
          <DocumentList page={slug} dict={dict} />
        ) : (
          <PendingNotice dict={dict} locale={locale} />
        )}
        {children}
        <section aria-labelledby="related-resources">
          <h2 id="related-resources" className="text-navy-900 text-2xl font-bold">
            {dict.nav.rules}
          </h2>
          <div className="mt-5">
            <ResourceCards locale={locale} dict={dict} />
          </div>
        </section>
      </div>
    </>
  );
}
