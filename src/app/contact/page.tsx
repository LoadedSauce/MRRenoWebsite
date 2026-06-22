import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { Container } from "@/components/container";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact \u00b7 M. R. Renovations",
  description:
    "Reach M. R. Renovations in Maple Grove, MN. Call 763-900-2024 or send a message. Family-owned design-build serving the Twin Cities for 40 years.",
};

const hours = [
  { day: "Monday \u2013 Friday", time: "7:00 AM \u2013 5:00 PM" },
  { day: "Saturday", time: "By appointment" },
  { day: "Sunday", time: "Closed" },
];

const serviceArea = [
  "Maple Grove",
  "Plymouth",
  "Wayzata",
  "Minnetonka",
  "Edina",
  "Rogers",
  "St. Michael",
  "Coon Rapids",
];

export default function ContactPage() {
  return (
    <PageShell>
      {/* ── Hero strip ─────────────────────────────────────────── */}
      <section className="bg-navy-deep text-paper">
        <Container width="wide" className="py-16 sm:py-20 lg:py-24">
          <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-soft-orange/95">
            Contact
          </p>
          <h1 className="mt-4 font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05] text-paper max-w-3xl">
            Talk to a <span className="accent">real person.</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg leading-relaxed text-soft-navy/90 max-w-2xl">
            Call, stop in, or send a message. Mike or someone on his team will get back to you within one business day.
          </p>
        </Container>
      </section>

      {/* ── Main content ───────────────────────────────────────── */}
      <section className="bg-paper">
        <Container width="wide" className="py-16 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left: business info */}
            <div className="lg:col-span-5">
              {/* Phone callout */}
              <div className="rounded-xl bg-soft-navy/70 border border-faint p-6 sm:p-7">
                <p className="font-display font-semibold tracking-[0.12em] uppercase text-xs text-orange">
                  Call us
                </p>
                <a
                  href="tel:7639002024"
                  className="mt-2 inline-block font-display font-bold text-3xl sm:text-4xl text-navy hover:text-orange transition-colors"
                  aria-label="Call 763-900-2024"
                >
                  763-900-2024
                </a>
                <p className="mt-2 text-sm text-muted">
                  Mike or his team answers directly. No phone tree.
                </p>
              </div>

              {/* Address */}
              <div className="mt-8">
                <p className="font-display font-semibold tracking-[0.12em] uppercase text-xs text-orange">
                  Visit
                </p>
                <address className="mt-3 not-italic text-base text-ink leading-relaxed">
                  <p>7201 Forestview Lane N., Lower Suite</p>
                  <p>Maple Grove, MN 55369</p>
                </address>
              </div>

              {/* Hours */}
              <div className="mt-8">
                <p className="font-display font-semibold tracking-[0.12em] uppercase text-xs text-orange">
                  Hours
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
                  Service area
                </p>
                <p className="mt-3 text-sm text-muted leading-relaxed">
                  We serve homeowners across the northwest Twin Cities metro, within roughly a 25-mile radius of Maple Grove.
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
                  Not sure if you&rsquo;re in our area? Send a message below and we&rsquo;ll let you know.
                </p>
              </div>

              {/* Ready to start? */}
              <div className="mt-8 rounded-xl bg-cream border border-cream-deep p-6">
                <p className="font-display font-semibold tracking-[0.12em] uppercase text-xs text-orange">
                  Ready to start a project?
                </p>
                <p className="mt-2 font-display font-bold text-lg text-ink">
                  Skip the form &mdash; book a free consultation.
                </p>
                <Link
                  href="/consultation"
                  className="mt-4 inline-flex items-center justify-center bg-orange hover:bg-orange-deep text-paper font-display font-semibold text-sm px-5 py-2.5 rounded-md transition-colors"
                >
                  Get a free estimate &rarr;
                </Link>
              </div>
            </div>

            {/* Right: contact form */}
            <div className="lg:col-span-7">
              <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange">
                Send a message
              </p>
              <h2 className="mt-3 font-display font-bold text-2xl sm:text-3xl tracking-tight text-ink leading-[1.15]">
                Have a question? We&rsquo;ll get back to you.
              </h2>
              <p className="mt-3 text-base text-muted leading-relaxed">
                For general questions, warranty inquiries, or anything else. We respond within one business day.
              </p>

              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
