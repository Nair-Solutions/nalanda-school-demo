import { resolveLocale } from "@/lib/page";
import { metadataFor } from "@/lib/metadata";
import { PageHeader } from "@/components/layout/PageHeader";
import { PendingNotice } from "@/components/ui/PendingNotice";
import { EnquiryForm } from "@/components/forms/EnquiryForm";

export const generateMetadata = metadataFor("admission", "admission");

export default async function AdmissionPage({ params }: PageProps<"/[locale]/admission">) {
  const { locale, dict } = await resolveLocale(params);
  const t = dict.admission;
  const steps = [
    [t.step1Title, t.step1Body],
    [t.step2Title, t.step2Body],
    [t.step3Title, t.step3Body],
  ];

  return (
    <>
      <PageHeader locale={locale} dict={dict} slug="admission" title={t.title} lead={t.lead} />
      <div className="container-page grid gap-14 py-12 sm:py-16">
        <section aria-labelledby="admission-steps">
          <h2 id="admission-steps" className="text-heading text-navy-900">
            {t.stepsHeading}
          </h2>
          {/* The order matters, so this is a real ordered list. */}
          <ol className="marker:font-display marker:text-crimson-800 mt-8 grid list-inside list-decimal gap-x-10 gap-y-8 marker:text-2xl marker:font-bold md:grid-cols-3">
            {steps.map(([title, body]) => (
              <li key={title}>
                <h3 className="text-title text-navy-900 inline">{title}</h3>
                <p className="text-body text-ink mt-2">{body}</p>
              </li>
            ))}
          </ol>
        </section>

        <PendingNotice
          dict={dict}
          locale={locale}
          heading={t.detailsHeading}
          detail={t.detailsBody}
          showCta={false}
        />

        <section
          id="admission-form"
          aria-labelledby="admission-form-heading"
          className="scroll-mt-24 rounded-3xl bg-white p-6 sm:p-10"
        >
          <h2 id="admission-form-heading" className="text-heading text-navy-900">
            {t.formHeading}
          </h2>
          <div className="mt-8 max-w-4xl">
            <EnquiryForm
              locale={locale}
              t={dict.form}
              defaultTopic="admission"
              idPrefix="admission"
            />
          </div>
        </section>
      </div>
    </>
  );
}
