import { MapPin, Phone } from "lucide-react";
import { resolveLocale } from "@/lib/page";
import { metadataFor } from "@/lib/metadata";
import { school } from "@/content/school";
import { PageHeader } from "@/components/layout/PageHeader";
import { EnquiryForm } from "@/components/forms/EnquiryForm";

export const generateMetadata = metadataFor("contact", "contact");

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale, dict } = await resolveLocale(params);
  const t = dict.contact;
  const hasDetails = Boolean(school.phone || school.email);

  return (
    <>
      <PageHeader locale={locale} dict={dict} slug="contact" title={t.title} lead={t.lead} />
      <div className="container-page grid gap-10 py-12 sm:py-16 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="grid content-start gap-2">
          <section aria-labelledby="contact-location" className="rounded-2xl bg-white p-6">
            <h2 id="contact-location" className="text-title text-navy-900 flex items-center gap-2">
              <MapPin aria-hidden="true" className="text-crimson-800" size={22} />
              {t.locationHeading}
            </h2>
            <p className="text-body mt-2">{school.postalAddress ?? dict.school.place}</p>
          </section>
          <section aria-labelledby="contact-details" className="rounded-2xl bg-white p-6">
            <h2 id="contact-details" className="text-title text-navy-900 flex items-center gap-2">
              <Phone aria-hidden="true" className="text-crimson-800" size={22} />
              {t.detailsHeading}
            </h2>
            {hasDetails ? (
              <ul className="text-body mt-2 grid gap-1">
                {school.phone && (
                  <li>
                    <a
                      href={`tel:${school.phone.replace(/\s/g, "")}`}
                      className="text-navy-800 font-semibold underline"
                    >
                      {school.phone}
                    </a>
                  </li>
                )}
                {school.email && (
                  <li>
                    <a
                      href={`mailto:${school.email}`}
                      className="text-navy-800 font-semibold underline"
                    >
                      {school.email}
                    </a>
                  </li>
                )}
              </ul>
            ) : (
              <p className="text-body text-ink mt-2" data-testid="contact-pending">
                {t.detailsPending}
              </p>
            )}
          </section>
        </div>
        <section aria-labelledby="contact-form" className="rounded-3xl bg-white p-6 sm:p-8">
          <h2 id="contact-form" className="text-heading text-navy-900">
            {t.formHeading}
          </h2>
          <div className="mt-6">
            <EnquiryForm locale={locale} t={dict.form} defaultTopic="other" idPrefix="contact" />
          </div>
        </section>
      </div>
    </>
  );
}
