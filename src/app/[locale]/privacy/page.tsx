import { resolveLocale } from "@/lib/page";
import { metadataFor } from "@/lib/metadata";
import { PageHeader } from "@/components/layout/PageHeader";

export const generateMetadata = metadataFor("privacy", "privacy");

export default async function PrivacyPage({ params }: PageProps<"/[locale]/privacy">) {
  const { locale, dict } = await resolveLocale(params);
  const t = dict.privacy;
  const sections = [
    [t.formHeading, t.formBody],
    [t.cookieHeading, t.cookieBody],
    [t.analyticsHeading, t.analyticsBody],
    [t.rightsHeading, t.rightsBody],
  ];
  return (
    <>
      <PageHeader locale={locale} dict={dict} slug="privacy" title={t.title} lead={t.lead} />
      <div className="container-page max-w-3xl py-12 sm:py-16">
        {sections.map(([heading, body]) => (
          <section key={heading} className="py-6 first:pt-0">
            <h2 className="text-title text-navy-900">{heading}</h2>
            <p className="text-body text-ink mt-2">{body}</p>
          </section>
        ))}
      </div>
    </>
  );
}
