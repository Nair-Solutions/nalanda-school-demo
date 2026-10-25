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
      <div className="container-page grid gap-12 py-12 sm:py-16">
        <section aria-labelledby="admission-steps">
          <h2 id="admission-steps" className="text-navy-900 text-2xl font-bold sm:text-3xl">
            {t.stepsHeading}
          </h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {steps.map(([title, body], index) => (
              <li
                key={title}
                className="border-line shadow-card relative rounded-xl border bg-white p-6"
              >
                <span className="bg-crimson-800 font-display flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="text-navy-900 mt-4 text-lg font-bold">{title}</h3>
                <p className="text-muted mt-1.5">{body}</p>
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
          aria-labelledby="admission-form"
          className="border-line shadow-card rounded-2xl border bg-white p-6 sm:p-10"
        >
          <h2 id="admission-form" className="text-navy-900 text-2xl font-bold sm:text-3xl">
            {t.formHeading}
          </h2>
          <div className="mt-6">
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
