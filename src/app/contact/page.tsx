import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { Container } from "@/components/container";
import { ContactForm } from "@/components/contact-form";
import { buildContactMetadata } from "@/lib/seo/routes";
import { loadPageContent, detectEditMode } from "@/lib/page-content/loader";
import { EditableText } from "@/components/editable/EditableText";
import { EditModeOverlay } from "@/components/editable/EditModeOverlay";

export const metadata: Metadata = buildContactMetadata();
export const revalidate = 3600;

const hours = [
  { day: "Monday to Friday", time: "7:00 AM to 5:00 PM" },
  { day: "Saturday", time: "By appointment" },
  { day: "Sunday", time: "Closed" },
];

const serviceArea = [
  "Rogers",
  "Maple Grove",
  "Plymouth",
  "St. Michael",
  "Coon Rapids",
  "Eden Prairie",
];

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const isEditMode = await detectEditMode(sp);
  const content = await loadPageContent("contact", isEditMode);

  return (
    <PageShell>
      {/* Hero strip */}
      <section className="bg-navy-deep text-paper">
        <Container width="wide" className="py-16 sm:py-20 lg:py-24">
          <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-soft-orange/95">
            <EditableText
              content={content}
              blockKey="contact.hero.eyebrow"
              fallback="Contact"
            />
          </p>
          <h1 className="mt-4 font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05] text-paper max-w-3xl">
            <EditableText
              content={content}
              blockKey="contact.hero.headline"
              fallback="Talk to a real person."
              multiline
            />
          </h1>
          <p className="mt-5 text-base sm:text-lg leading-relaxed text-soft-navy/90 max-w-2xl">
            <EditableText
              content={content}
              blockKey="contact.hero.subcopy"
              fallback="Call, stop in, or send a message. Mike or someone on his team will get back to you within one business day."
              multiline
            />
          </p>
        </Container>
      </section>

      {/* Main content */}
      <section className="bg-paper">
        <Container width="wide" className="py-16 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left: business info */}
            <div className="lg:col-span-5">
              {/* Phone callout */}
              <div className="rounded-xl bg-soft-navy/70 border border-faint p-6 sm:p-7">
                <p className="font-display font-semibold tracking-[0.12em] uppercase text-xs text-orange">
                  <EditableText
                    content={content}
                    blockKey="contact.phone.eyebrow"
                    fallback="Call us"
                  />
                </p>
                <a
                  href="tel:7639002024"
                  className="mt-2 inline-block font-display font-bold text-3xl sm:text-4xl text-navy hover:text-orange transition-colors"
                  aria-label="Call 763-900-2024"
                >
                  763-900-2024
                </a>
                <p className="mt-2 text-sm text-muted">
                  <EditableText
                    content={content}
                    blockKey="contact.phone.subcopy"
                    fallback="Mike or his team answers directly. No phone tree."
                  />
                </p>
              </div>

              {/* Address */}
              <div className="mt-8">
                <p className="font-display font-semibold tracking-[0.12em] uppercase text-xs text-orange">
                  <EditableText
                    content={content}
                    blockKey="contact.address.eyebrow"
                    fallback="Visit"
                  />
                </p>
                {/* Office is the NAP-of-record. The Otsego shop is display-only
                    -- no second phone number, and it stays out of SITE.address
                    and all structured data. Rule 25: never editable. */}
                <address className="mt-3 not-italic text-base text-ink leading-relaxed space-y-4">
                  <div>
                    <p className="font-display font-semibold text-navy text-xs uppercase tracking-[0.12em] mb-1">
                      Office
                    </p>
                    <p>7201 Forestview Lane N., Lower Suite</p>
                    <p>Maple Grove, MN 55369</p>
                  </div>
                  <div>
                    <p className="font-display font-semibold text-navy text-xs uppercase tracking-[0.12em] mb-1">
                      Shop / Warehouse
                    </p>
                    <p>9781 NE 71st Street, Suite F</p>
                    <p>Otsego, MN 55301</p>
                  </div>
                </address>
              </div>

              {/* Hours */}
              <div className="mt-8">
                <p className="font-display font-semibold tracking-[0.12em] uppercase text-xs text-orange">
                  <EditableText
                    content={content}
                    blockKey="contact.hours.eyebrow"
                    fallback="Hours"
                  />
                </p>
                <dl className="mt-3 space-y-2 text-sm">
                  {hours.map((h) => (
                    <div key={h.day} className="flex items-baseline justify-between gap-4 border-b border-faint pb-2 last:border-0">
                      <dt className="text-ink font-medium">{h.day}</dt>
                      <dd className="text-muted">{h.time}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Service area */}
              <div className="mt-8">
                <p className="font-display font-semibold tracking-[0.12em] uppercase text-xs text-orange">
                  <EditableText
                    content={content}
                    blockKey="contact.service-area.eyebrow"
                    fallback="Service area"
                  />
                </p>
                <p className="mt-3 text-sm text-muted leading-relaxed">
                  <EditableText
                    content={content}
                    blockKey="contact.service-area.subcopy"
                    fallback="We serve homeowners across the northwest Twin Cities metro, within roughly a 25-mile radius of Maple Grove."
                    multiline
                  />
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {serviceArea.map((city) => (
                    <li
                      key={city}
                      className="inline-flex items-center rounded-full bg-soft-navy/60 border border-faint px-3 py-1 text-xs font-display font-semibold text-navy"
                    >
                      {city}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-muted">
                  <EditableText
                    content={content}
                    blockKey="contact.service-area.footnote"
                    fallback="Not sure if you are in our area? Send a message below and we will let you know."
                  />
                </p>
              </div>

              {/* Ready to start? */}
              <div className="mt-8 rounded-xl bg-cream border border-cream-deep p-6">
                <p className="font-display font-semibold tracking-[0.12em] uppercase text-xs text-orange">
                  <EditableText
                    content={content}
                    blockKey="contact.ready.eyebrow"
                    fallback="Ready to start a project?"
                  />
                </p>
                <p className="mt-2 font-display font-bold text-lg text-ink">
                  <EditableText
                    content={content}
                    blockKey="contact.ready.headline"
                    fallback="Skip the form. Book a free consultation."
                  />
                </p>
                <Link
                  href="/consultation"
                  className="mt-4 inline-flex items-center justify-center bg-orange hover:brightness-105 text-ink font-display font-semibold text-sm px-5 py-2.5 rounded-md transition"
                >
                  <EditableText
                    content={content}
                    blockKey="contact.ready.cta"
                    fallback="Get a free estimate"
                  />
                </Link>
              </div>
            </div>

            {/* Right: contact form */}
            <div className="lg:col-span-7">
              <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange">
                <EditableText
                  content={content}
                  blockKey="contact.form.eyebrow"
                  fallback="Send a message"
                />
              </p>
              <h2 className="mt-3 font-display font-bold text-2xl sm:text-3xl tracking-tight text-ink leading-[1.15]">
                <EditableText
                  content={content}
                  blockKey="contact.form.headline"
                  fallback="Have a question? We will get back to you."
                  multiline
                />
              </h2>
              <p className="mt-3 text-base text-muted leading-relaxed">
                <EditableText
                  content={content}
                  blockKey="contact.form.subcopy"
                  fallback="For general questions, warranty inquiries, or anything else. We respond within one business day."
                  multiline
                />
              </p>

              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {content.isEditMode ? <EditModeOverlay currentPath="/contact?edit=1" /> : null}
    </PageShell>
  );
}
