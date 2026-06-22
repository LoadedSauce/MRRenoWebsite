import Image from "next/image";

export interface BeforeAfterImage {
  src: string;
  alt: string;
}

export interface BeforeAfterProps {
  before: BeforeAfterImage;
  after: BeforeAfterImage;
  /** Optional caption below the pair */
  caption?: string;
}

/**
 * Static before/after comparison.
 *
 * Desktop: side-by-side, before left, after right.
 * Mobile:  stacked vertically, before on top, after below.
 * No slider. No drag interaction. No hover overlay.
 */
export function BeforeAfter({ before, after, caption }: BeforeAfterProps) {
  return (
    <figure>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Before */}
        <div>
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-navy">
            <Image
              src={before.src}
              alt={before.alt}
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <p className="mt-2.5 flex items-center gap-1.5">
            <span
              className="inline-block w-2 h-2 rounded-full bg-muted shrink-0"
              aria-hidden="true"
            />
            <span className="font-display font-semibold text-xs uppercase tracking-[0.12em] text-muted">
              Before
            </span>
          </p>
        </div>

        {/* After */}
        <div>
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-navy">
            <Image
              src={after.src}
              alt={after.alt}
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <p className="mt-2.5 flex items-center gap-1.5">
            <span
              className="inline-block w-2 h-2 rounded-full bg-orange shrink-0"
              aria-hidden="true"
            />
            <span className="font-display font-semibold text-xs uppercase tracking-[0.12em] text-orange">
              After
            </span>
          </p>
        </div>
      </div>

      {caption && (
        <figcaption className="mt-4 text-sm text-muted text-center leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}