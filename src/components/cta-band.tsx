import Link from "next/link";
import { type ReactNode } from "react";
import { Container } from "./container";

interface CTAAction {
  label: string;
  href: string;
}

interface CTABandProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  primary: CTAAction;
  secondary?: CTAAction;
  tertiary?: CTAAction[];
  tone?: "navy" | "tinted" | "paper";
}

export function CTABand({
  eyebrow,
  title,
  description,
  primary,
  secondary,
  tertiary,
  tone = "navy",
}: CTABandProps) {
  const isNavy = tone === "navy";
  const isTinted = tone === "tinted";

  const bgClass = isNavy
    ? "bg-navy text-paper"
    : isTinted
    ? "bg-soft-navy text-ink"
    : "bg-paper text-ink";

  // "tinted" (soft-navy) and "paper" (white) are both light surfaces where the
  // base orange token fails AA for small text -- drop to orange-deep there.
  // "navy" keeps the base orange, which already clears contrast on that surface.
  const eyebrowClass = isNavy ? "text-orange" : "text-orange-deep";
  const titleClass = isNavy ? "text-paper" : "text-ink";
  const descClass = isNavy ? "text-soft-navy" : "text-muted";

  const primaryBtnClass =
    "inline-flex items-center justify-center bg-orange hover:bg-orange-deep text-paper font-display font-semibold px-6 py-3 rounded-md transition-colors";

  const secondaryBtnClass = isNavy
    ? "inline-flex items-center justify-center bg-paper/10 hover:bg-paper/20 text-paper border border-paper/30 font-display font-semibold px-6 py-3 rounded-md transition-colors"
    : "inline-flex items-center justify-center bg-paper hover:bg-soft-navy text-navy border border-faint font-display font-semibold px-6 py-3 rounded-md transition-colors";

  const tertiaryLinkClass = isNavy
    ? "text-sm text-soft-navy hover:text-paper underline underline-offset-4 transition-colors"
    : "text-sm text-navy hover:text-orange underline underline-offset-4 transition-colors";

  return (
    <section className={`${bgClass}`}>
      <Container width="wide" as="div" className="py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            {eyebrow ? (
              <p
                className={`font-display font-semibold tracking-[0.12em] uppercase text-xs mb-3 ${eyebrowClass}`}
              >
                {eyebrow}
              </p>
            ) : null}
            <h2
              className={`font-display font-bold text-3xl sm:text-4xl tracking-tight ${titleClass}`}
            >
              {title}
            </h2>
            {description ? (
              <p
                className={`mt-4 text-base sm:text-lg leading-relaxed max-w-2xl ${descClass}`}
              >
                {description}
              </p>
            ) : null}
          </div>

          <div className="lg:col-span-5 flex flex-col gap-3 lg:items-end">
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Link href={primary.href} className={primaryBtnClass}>
                {primary.label}
              </Link>
              {secondary ? (
                <Link href={secondary.href} className={secondaryBtnClass}>
                  {secondary.label}
                </Link>
              ) : null}
            </div>

            {tertiary && tertiary.length > 0 ? (
              <div className="flex flex-wrap gap-x-5 gap-y-2 mt-1 lg:justify-end">
                {tertiary.map((action) => (
                  <Link key={action.href} href={action.href} className={tertiaryLinkClass}>
                    {action.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
