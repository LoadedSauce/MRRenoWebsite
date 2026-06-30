import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { Container } from "@/components/container";
import { buildPrivacyMetadata } from "@/lib/seo/routes";

export const metadata: Metadata = buildPrivacyMetadata();

export default function PrivacyPage() {
  return (
    <PageShell>
      <section className="bg-paper">
        <Container width="narrow" className="py-16 lg:py-24">
          <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange">
            Legal
          </p>
          <h1 className="mt-3 font-display font-bold text-4xl sm:text-5xl tracking-tight text-navy leading-[1.05]">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-muted">Last updated: June 2026</p>

          <div className="mt-10">
            <h2 className="font-display font-bold text-lg text-ink mt-8 mb-3">Who We Are</h2>
            <p className="text-muted leading-relaxed">
              M.R. Renovations, LLC operates the website at m-r-reno.com. We are a
              residential remodeling contractor based in Maple Grove, MN. Questions
              about this policy can be directed to{" "}
              <a
                href="mailto:j.walker@mrrenovations-llc.com"
                className="text-orange underline underline-offset-2"
              >
                j.walker@mrrenovations-llc.com
              </a>{" "}
              or by calling{" "}
              <a href="tel:7639002024" className="text-orange underline underline-offset-2">
                (763) 900-2024
              </a>
              .
            </p>

            <h2 className="font-display font-bold text-lg text-ink mt-8 mb-3">
              Information We Collect
            </h2>
            <p className="text-muted leading-relaxed">
              When you submit a consultation request or contact form, we collect the
              information you provide -- including your name, email address, phone
              number, project address, project description, and any photos you choose
              to upload. We do not collect this information passively or without your
              action.
            </p>

            <h2 className="font-display font-bold text-lg text-ink mt-8 mb-3">
              How We Use Your Information
            </h2>
            <p className="text-muted leading-relaxed">
              We use the information you submit to respond to your inquiry, schedule
              in-home consultations, prepare project estimates, and communicate about
              your project. We do not sell, rent, or share your personal information
              with third parties for marketing purposes.
            </p>

            <h2 className="font-display font-bold text-lg text-ink mt-8 mb-3">
              Third-Party Services
            </h2>
            <p className="text-muted leading-relaxed">
              Our website uses the following third-party services that may process
              data on our behalf:
            </p>
            <ul className="mt-3 space-y-2 text-muted leading-relaxed list-disc pl-5">
              <li>Supabase -- secure database storage for lead and project information.</li>
              <li>
                Hearth (NMLS ID 1628533) -- financing pre-qualification (their privacy
                policy applies when you visit the Hearth portal at app.gethearth.com).
              </li>
              <li>Vercel -- website hosting and delivery infrastructure.</li>
            </ul>

            <h2 className="font-display font-bold text-lg text-ink mt-8 mb-3">Photos</h2>
            <p className="text-muted leading-relaxed">
              If you upload photos as part of a consultation request, those photos are
              stored securely and used only to assist in preparing your project
              estimate. Photos are not shared publicly or used for marketing without
              your explicit permission.
            </p>

            <h2 className="font-display font-bold text-lg text-ink mt-8 mb-3">
              Cookies and Analytics
            </h2>
            <p className="text-muted leading-relaxed">
              This website does not currently use advertising cookies or behavioral
              tracking. Standard server logs may capture your IP address and browser
              type as part of normal web infrastructure operation.
            </p>

            <h2 className="font-display font-bold text-lg text-ink mt-8 mb-3">
              Data Retention
            </h2>
            <p className="text-muted leading-relaxed">
              We retain inquiry and project information for as long as it is reasonably
              necessary to fulfill the purposes described above, or as required by
              applicable law.
            </p>

            <h2 className="font-display font-bold text-lg text-ink mt-8 mb-3">Your Rights</h2>
            <p className="text-muted leading-relaxed">
              You may request access to, correction of, or deletion of personal
              information we hold about you by contacting us at{" "}
              <a
                href="mailto:j.walker@mrrenovations-llc.com"
                className="text-orange underline underline-offset-2"
              >
                j.walker@mrrenovations-llc.com
              </a>
              .
            </p>

            <h2 className="font-display font-bold text-lg text-ink mt-8 mb-3">
              Changes to This Policy
            </h2>
            <p className="text-muted leading-relaxed">
              We may update this policy as our practices change. Material changes will
              be noted with an updated date at the top of this page.
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
              <br />
              j.walker@mrrenovations-llc.com
            </address>
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
