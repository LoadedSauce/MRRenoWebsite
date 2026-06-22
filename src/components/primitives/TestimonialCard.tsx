import Image from "next/image";

export interface TestimonialCardProps {
  quote: string;
  authorName: string;
  authorCity?: string;
  projectType?: string;
  avatarSrc?: string;
  avatarAlt?: string;
  /**
   * 1â€“5 stars. Omit to render no stars.
   * Only pass when the attribution source supports a verified rating.
   */
  starCount?: 1 | 2 | 3 | 4 | 5;
  tone?: "cream" | "paper" | "navy";
  align?: "left" | "center";
}

/**
 * Quote-first testimonial card.
 *
 * Matches the review section treatment in page.tsx:
 * optional stars â†’ decorative opening quote mark â†’ quote text â†’ attribution.
 * Dense and readable. Appropriate for single-quote hero treatment
 * or as a repeating card in a testimonial grid.
 */
export function TestimonialCard({
  quote,
  authorName,
  authorCity,
  projectType,
  avatarSrc,
  avatarAlt = "",
  starCount,
  tone = "cream",
  align = "center",
}: TestimonialCardProps) {
  const surfaceClass =
    tone === "navy"
      ? "bg-navy border border-paper/15"
      : tone === "paper"
      ? "bg-paper border border-faint shadow-sm"
      : "bg-cream border border-cream-deep";

  const quoteTextClass   = tone === "navy" ? "text-paper"           : "text-ink";
  const attributeClass   = tone === "navy" ? "text-on-navy-muted"   : "text-muted";
  const nameClass        = tone === "navy" ? "text-paper"           : "text-ink";
  const alignClass       = align === "center" ? "text-center" : "text-left";
  const itemsClass       = align === "center" ? "items-center" : "items-start";
  const captionJustify   = align === "center" ? "justify-center" : "";

  const attribution = [authorCity, projectType].filter(Boolean).join(" \u00b7 ");

  return (
    <figure className={`rounded-xl p-7 sm:p-8 flex flex-col gap-3 ${surfaceClass} ${alignClass} ${itemsClass}`}>
      {/* Stars */}
      {starCount !== undefined && (
        <p
          className="text-orange text-base leading-none"
          aria-label={`${starCount} out of 5 stars`}
        >
          {"&#9733;".repeat(0).padEnd(0)}
          {Array.from({ length: starCount }, (_, i) => (
            <span key={i} aria-hidden="true">&#9733;</span>
          ))}
        </p>
      )}

      {/* Decorative opening quote mark */}
      <span
        className="font-display font-bold text-5xl text-orange leading-none select-none"
        aria-hidden="true"
      >
        &ldquo;
      </span>

      {/* Quote text */}
      <blockquote>
        <p className={`font-display font-bold text-xl sm:text-2xl leading-snug ${quoteTextClass}`}>
          {quote}
        </p>
      </blockquote>

      {/* Attribution */}
      <figcaption className={`flex items-center gap-3 mt-1 ${captionJustify}`}>
        {avatarSrc && (
          <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 bg-navy">
            <Image
              src={avatarSrc}
              alt={avatarAlt}
              fill
              sizes="36px"
              className="object-cover"
            />
          </div>
        )}
        <p className={`font-display font-semibold text-xs uppercase tracking-[0.08em] ${nameClass}`}>
          {authorName}
          {attribution && (
            <>
              {" "}
              <span className="text-orange">&middot;</span>{" "}
              <span className={attributeClass}>{attribution}</span>
            </>
          )}
        </p>
      </figcaption>
    </figure>
  );
}