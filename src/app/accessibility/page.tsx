import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { Container } from "@/components/container";
import { buildAccessibilityMetadata } from "@/lib/seo/routes";

export const metadata: Metadata = buildAccessibilityMetadata();

export default function AccessibilityPage() {
  return (
    <PageShell>
      <section className="bg-paper">
        <Container width="narrow" className="py-16 lg:py-24">
          <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange">
            Legal
          </p>
          <h1 className="mt-3 font-display font-bold text-4xl sm:text-5xl tracking-tight text-navy leading-[1.05]">
            Accessibility Statement
          </h1>
          <p className="mt-3 text-sm text-muted">Last updated: June 2026</p>

          <div className="mt-10">
            <p className="text-muted leading-relaxed">
              M.R. Renovations is committed to ensuring this website is accessible to
              people with disabilities.
            </p>

            <h2 className="font-display font-bold text-lg text-ink mt-8 mb-3">Standards</h2>
            <p className="text-muted leading-relaxed">
              We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1
              Level AA. Our site uses semantic HTML, sufficient color contrast ratios,
              keyboard-navigable components, and descriptive alt text on images.
            </p>

            <h2 className="font-display font-bold text-lg text-ink mt-8 mb-3">
              Known Limitations
            </h2>
            <p className="text-muted leading-relaxed">
              Some project images may have limited alt text. We are working to improve
              descriptions for all visual content.
            </p>

            <h2 className="font-display font-bold text-lg text-ink mt-8 mb-3">Feedback</h2>
            <p className="text-muted leading-relaxed">
              If you experience difficulty accessing any content on this site or have
              suggestions for improvement, please contact us at{" "}
              <a
                href="mailto:j.walker@mrrenovations-llc.com"
                className="text-orange underline underline-offset-2"
              >
                j.walker@mrrenovations-llc.com
              </a>{" "}
              or call{" "}
              <a href="tel:7639002024" className="text-orange underline underline-offset-2">
                (763) 900-2024
              </a>
              . We will make reasonable efforts to provide the information you need in
              an alternative format.
            </p>

            <h2 className="font-display font-bold text-lg text-ink mt-8 mb-3">Contact</h2>
            <address className="not-italic text-muted leading-relaxed">
              M.R. Renovations, LLC
              <br />
              (763) 900-2024
              <br />
              j.walker@mrrenovations-llc.com
            </address>
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
