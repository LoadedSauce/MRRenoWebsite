import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import type { ReactNode } from "react";

export interface HeroStat {
  label: string;
  value: string;
}

export interface HeroCta {
  label: string;
  href: string;
}

export interface HeroProps {
  /** Small uppercase label above the headline */
  eyebrow?: string;
  /** Pass a ReactNode to include <span className="accent"> phrases */
  headline: ReactNode;
  /** One compact paragraph of sub-copy */
  subCopy: string;
  primaryCta: HeroCta;
  secondaryCta?: HeroCta;
  /** Optional stat strip below the CTAs */
  stats?: HeroStat[];
  /** Real project photograph â€” omit to render the design-system placeholder */
  imageSrc?: string;
  imageAlt?: string;
}

/**
 * Service-page hero primitive.
 *
 * Desktop: 2-column split â€” text left (~60 %), image right (~40 %).
 * Mobile:  image stacks above copy; CTAs expand to full width.
 * No background video, no carousel, no overlay gradient on the image column.
 */
export function Hero({
  eyebrow,
  headline,
  subCopy,
  primaryCta,
  secondaryCta,
  stats,
  imageSrc,
  imageAlt = "",
}: HeroProps) {
  return (
    <section className="bg-navy-deep text-paper">
      <Container width="wide" className="py-16 sm:py-20 lg:py-24">
        {/*
          flex-col-reverse: image (second in DOM) appears above text on mobile.
          lg:grid: text left col, image right col on desktop.
        */}
        <div className="flex flex-col-reverse gap-8 lg:grid lg:grid-cols-[3fr_2fr] lg:gap-12 xl:gap-16 lg:items-center">

          {/* â”€â”€ Text column â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div>
            {eyebrow && (
              <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange">
                {eyebrow}
              </p>
            )}
            <h1 className="mt-4 font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05] text-paper">
              {headline}
            </h1>
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-soft-navy/95 max-w-xl">
              {subCopy}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href={primaryCta.href}
                className="inline-flex items-center justify-center w-full sm:w-auto bg-orange hover:bg-orange-deep text-paper font-display font-semibold px-6 py-3.5 rounded-md transition-colors"
              >
                {primaryCta.label}
              </Link>
              {secondaryCta && (
                <Link
                  href={secondaryCta.href}
                  className="inline-flex items-center justify-center w-full sm:w-auto bg-paper/10 hover:bg-paper/20 text-paper border border-paper/40 font-display font-semibold px-6 py-3.5 rounded-md transition-colors"
                >
                  {secondaryCta.label}
                </Link>
              )}
            </div>

            {stats && stats.length > 0 && (
              <dl className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-y-5 gap-x-8 border-t border-paper/15 pt-7">
                {stats.map((s) => (
                  <div key={s.label}>
                    <dt className="font-display font-semibold tracking-[0.12em] uppercase text-[10px] text-soft-orange/90">
                      {s.label}
                    </dt>
                    <dd className="mt-1 font-display font-bold text-3xl text-paper">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          {/* â”€â”€ Image column â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 hero-photo-placeholder" aria-hidden="true" />
            )}
          </div>

        </div>
      </Container>
    </section>
  );
}