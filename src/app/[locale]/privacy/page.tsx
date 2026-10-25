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
          <section key={heading} className="border-line border-b py-6 first:pt-0 last:border-0">
            <h2 className="text-navy-900 text-xl font-bold">{heading}</h2>
            <p className="text-muted mt-2 text-lg leading-relaxed">{body}</p>
          </section>
        ))}
      </div>
    </>
  );
}
