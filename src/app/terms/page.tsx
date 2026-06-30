import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { Container } from "@/components/container";
import { buildTermsMetadata } from "@/lib/seo/routes";

export const metadata: Metadata = buildTermsMetadata();

export default function TermsPage() {
  return (
    <PageShell>
      <section className="bg-paper">
        <Container width="narrow" className="py-16 lg:py-24">
          <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange">
            Legal
          </p>
          <h1 className="mt-3 font-display font-bold text-4xl sm:text-5xl tracking-tight text-navy leading-[1.05]">
            Terms of Use
          </h1>
          <p className="mt-3 text-sm text-muted">Last updated: June 2026</p>

          <div className="mt-10">
            <p className="text-muted leading-relaxed">
              This website is operated by M.R. Renovations, LLC. By using this site,
              you agree to the following terms.
            </p>

            <h2 className="font-display font-bold text-lg text-ink mt-8 mb-3">
              Use of This Site
            </h2>
            <p className="text-muted leading-relaxed">
              This website is provided for informational purposes and to facilitate
              contact with M.R. Renovations. You may not use this site for unlawful
              purposes or in any way that could damage, disable, or impair the site.
            </p>

            <h2 className="font-display font-bold text-lg text-ink mt-8 mb-3">
              No Contractor-Client Relationship
            </h2>
            <p className="text-muted leading-relaxed">
              Submitting a consultation request or contact form does not create a
              contractor-client relationship. A relationship is established only upon
              execution of a written contract signed by both parties.
            </p>

            <h2 className="font-display font-bold text-lg text-ink mt-8 mb-3">
              Project Estimates
            </h2>
            <p className="text-muted leading-relaxed">
              Any estimates discussed during a consultation are preliminary and
              subject to change based on final scope, materials, and site conditions.
              Binding pricing is provided only in a written, signed contract.
            </p>

            <h2 className="font-display font-bold text-lg text-ink mt-8 mb-3">
              Intellectual Property
            </h2>
            <p className="text-muted leading-relaxed">
              All content on this site -- including text, images, and graphics -- is
              the property of M.R. Renovations, LLC or its content suppliers. You may
              not reproduce or distribute content from this site without written
              permission.
            </p>

            <h2 className="font-display font-bold text-lg text-ink mt-8 mb-3">Disclaimer</h2>
            <p className="text-muted leading-relaxed">
              Project timelines and cost ranges described on this site are typical
              examples. Actual timelines and costs vary based on project scope and
              conditions.
            </p>

            <h2 className="font-display font-bold text-lg text-ink mt-8 mb-3">
              Governing Law
            </h2>
            <p className="text-muted leading-relaxed">
              These terms are governed by the laws of the State of Minnesota.
            </p>

            <h2 className="font-display font-bold text-lg text-ink mt-8 mb-3">Contact</h2>
            <address className="not-italic text-muted leading-relaxed">
              M.R. Renovations, LLC
              <br />
              7201 Forestview Lane N., Lower Suite
              <br />
              Maple Grove, MN 55369
              <br />
              (763) 900-2024
            </address>
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
