import { resolveLocale } from "@/lib/page";
import { metadataFor } from "@/lib/metadata";
import { PageHeader } from "@/components/layout/PageHeader";
import { ResourceList } from "@/components/ui/ResourceList";

export const generateMetadata = metadataFor("rules-and-regulations", "rules");

export default async function RulesPage({ params }: PageProps<"/[locale]/rules-and-regulations">) {
  const { locale, dict } = await resolveLocale(params);
  return (
    <>
      <PageHeader
        locale={locale}
        dict={dict}
        slug="rules-and-regulations"
        title={dict.rules.title}
        lead={dict.rules.lead}
      />
      <div className="container-page py-12 sm:py-16">
        <ResourceList locale={locale} dict={dict} headingLevel={2} />
      </div>
    </>
  );
}
