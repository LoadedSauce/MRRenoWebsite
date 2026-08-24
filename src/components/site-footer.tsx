import Link from "next/link";
import Image from "next/image";
import { Container } from "./container";
import type { PageContent } from "@/lib/page-content/loader";
import { EditableText } from "./editable/EditableText";

const services = [
  { label: "Kitchens", href: "/services/kitchens" },
  { label: "Bathrooms", href: "/services/bathrooms" },
  { label: "Basements", href: "/services/basements" },
  { label: "Additions", href: "/services/additions" },
  { label: "Whole-Home", href: "/services/whole-home" },
  { label: "Exterior", href: "/services/exterior" },
];

const company = [
  { label: "Team", href: "/team" },
  { label: "Process", href: "/process" },
  { label: "Warranty", href: "/warranty" },
  { label: "Resources", href: "/resources" },
  { label: "Financing", href: "/financing" },
  { label: "Contact", href: "/contact" },
  { label: "Careers", href: "/careers" },
];

const serviceArea = [
  "Maple Grove & Surrounding",
  "Plymouth",
  "Rogers",
  "St. Michael",
  "Coon Rapids",
  "Eden Prairie",
  "Andover",
  "Elk River",
];

interface SiteFooterProps {
  content: PageContent;
}

export function SiteFooter({ content }: SiteFooterProps) {
  return (
    <footer className="bg-navy-deep text-paper">
      <Container width="wide" className="py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <Image
                src="/images/mr-logo-icon.png"
                alt="M.R. Renovations logo"
                width={48}
                height={53}
                className="shrink-0 brightness-0 invert"
              />
              <p className="font-display font-bold text-paper text-lg tracking-tight">
                M.&nbsp;R. Renovations, LLC
              </p>
            </div>
            <p className="mt-5 text-sm text-soft-navy/85 leading-relaxed max-w-sm">
              <EditableText
                content={content}
                blockKey="global.footer.brand.tagline"
                fallback="Family-owned design-build serving Maple Grove and the Twin Cities for 40+ years."
                multiline
              />
            </p>
            {/* Office is the NAP-of-record. The Otsego shop is display-only --
                it is deliberately absent from SITE.address, LocalBusiness
                schema, and the sitemap (no matching GBP listing). */}
            <address className="mt-5 not-italic text-sm text-soft-navy/85 leading-relaxed space-y-4">
              <div>
                <p className="font-display font-semibold text-paper text-xs uppercase tracking-[0.12em] mb-1">
                  Office
                </p>
                <p>7201 Forestview Lane N., Lower Suite</p>
                <p>Maple Grove, MN 55369</p>
              </div>
              <div>
                <p className="font-display font-semibold text-paper text-xs uppercase tracking-[0.12em] mb-1">
                  Shop
                </p>
                <p>9781 NE 71st Street, Suite F</p>
                <p>Otsego, MN 55301</p>
              </div>
              <p className="pt-2">
                <a
                  href="tel:7639002024"
                  className="font-display font-semibold text-paper hover:text-orange transition-colors"
                >
                  763-900-2024
                </a>
              </p>
            </address>
          </div>

          <div className="lg:col-span-3">
            <p className="font-display font-semibold text-paper text-xs uppercase tracking-[0.14em]">
              <EditableText
                content={content}
                blockKey="global.footer.services.label"
                fallback="Services"
              />
            </p>
            <ul className="mt-4 space-y-2.5">
              {services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-soft-navy/85 hover:text-paper transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="font-display font-semibold text-paper text-xs uppercase tracking-[0.14em]">
              <EditableText
                content={content}
                blockKey="global.footer.company.label"
                fallback="Company"
              />
            </p>
            <ul className="mt-4 space-y-2.5">
              {company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-soft-navy/85 hover:text-paper transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="font-display font-semibold text-paper text-xs uppercase tracking-[0.14em]">
              <EditableText
                content={content}
                blockKey="global.footer.service-area.label"
                fallback="Service Area"
              />
            </p>
            <ul className="mt-4 space-y-2.5">
              {serviceArea.map((label) => (
                <li key={label} className="text-sm text-soft-navy/85">
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      <div className="border-t border-paper/15">
        <Container width="wide" className="py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-soft-navy/70">
            &copy; {new Date().getFullYear()}{" "}
            <EditableText
              content={content}
              blockKey="global.footer.copyright.suffix"
              fallback="M. R. Renovations, LLC. MN License #BC809200"
            />
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="text-xs text-soft-navy/70 hover:text-paper transition-colors">
              <EditableText
                content={content}
                blockKey="global.footer.legal.privacy"
                fallback="Privacy"
              />
            </Link>
            <Link href="/terms" className="text-xs text-soft-navy/70 hover:text-paper transition-colors">
              <EditableText
                content={content}
                blockKey="global.footer.legal.terms"
                fallback="Terms"
              />
            </Link>
            <Link href="/accessibility" className="text-xs text-soft-navy/70 hover:text-paper transition-colors">
              <EditableText
                content={content}
                blockKey="global.footer.legal.accessibility"
                fallback="Accessibility"
              />
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}

