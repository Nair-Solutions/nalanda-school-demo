import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { PageSlug } from "@/content/routes";
import { documentsFor } from "@/content/documents";
import { PageHeader } from "./PageHeader";
import { DocumentList } from "@/components/ui/DocumentList";
import { PendingNotice } from "@/components/ui/PendingNotice";
import { ResourceList } from "@/components/ui/ResourceList";
import { RulesPager } from "@/components/navigation/RulesPager";

interface Props {
  locale: Locale;
  dict: Dictionary;
  slug: PageSlug;
  title: string;
  lead: string;
  children?: ReactNode;
}

/**
 * A Rules & Regulations page in Read mode: the documents (or an honest
 * pending notice), then wayfinding to the neighbouring pages.
 */
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
      <div className="container-page grid gap-12 py-12 sm:py-16">
        <div className="max-w-4xl">
          {hasDocs ? (
            <DocumentList page={slug} dict={dict} locale={locale} />
          ) : (
            <PendingNotice dict={dict} locale={locale} />
          )}
        </div>
        {children && <div className="max-w-4xl">{children}</div>}
        <RulesPager locale={locale} dict={dict} slug={slug} />
        <section aria-labelledby="related-resources">
          <h2 id="related-resources" className="text-heading text-navy-900">
            {dict.nav.rules}
          </h2>
          <div className="mt-6">
            <ResourceList locale={locale} dict={dict} exclude={slug} />
          </div>
        </section>
      </div>
    </>
  );
}
