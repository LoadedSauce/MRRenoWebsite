"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";

export interface GalleryImage {
  src: string;
  alt: string;
  /** Optional caption shown only inside the lightbox */
  caption?: string;
}

interface GalleryProps {
  images: GalleryImage[];
}

/**
 * Project photo gallery.
 *
 * Grid: 3-col desktop / 2-col mobile.
 * Click any image to open a lightbox with prev/next/close.
 * Keyboard: Escape closes, ArrowLeft/ArrowRight navigates.
 * No autoplay. No carousel. No masonry.
 */
export function Gallery({ images }: GalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const isOpen = activeIndex !== null;

  const close = useCallback(() => {
    setActiveIndex(null);
    lastTriggerRef.current?.focus();
    lastTriggerRef.current = null;
  }, []);

  const prev = useCallback(
    () =>
      setActiveIndex((i) =>
        i !== null ? (i - 1 + images.length) % images.length : null
      ),
    [images.length]
  );

  const next = useCallback(
    () =>
      setActiveIndex((i) =>
        i !== null ? (i + 1) % images.length : null
      ),
    [images.length]
  );

  // Keyboard navigation + scroll lock when lightbox is open
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close, prev, next]);

  // Move focus to close button when lightbox opens
  useEffect(() => {
    if (isOpen) closeButtonRef.current?.focus();
  }, [isOpen]);

  return (
    <>
      {/* â”€â”€ Grid â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={(e) => {
              lastTriggerRef.current = e.currentTarget;
              setActiveIndex(i);
            }}
            className="group block rounded-lg overflow-hidden bg-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
            aria-label={`View photo: ${img.alt}`}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 1024px) 33vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </button>
        ))}
      </div>

      {/* â”€â”€ Lightbox â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {isOpen && activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo lightbox"
          className="fixed inset-0 z-[60] bg-ink/90 flex items-center justify-center p-4"
          onClick={close}
        >
          {/* Close */}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            className="absolute top-4 right-4 inline-flex items-center justify-center w-11 h-11 rounded-md text-paper hover:text-orange transition-colors"
            aria-label="Close lightbox"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Prev */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-11 h-11 rounded-md text-paper hover:text-orange transition-colors"
            aria-label="Previous photo"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Image */}
          <div
            className="relative w-full max-w-5xl h-[70vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[activeIndex].src}
              alt={images[activeIndex].alt}
              fill
              sizes="90vw"
              className="object-contain"
              priority
            />
            {images[activeIndex].caption && (
              <p className="absolute -bottom-8 left-0 right-0 text-center text-paper/70 text-sm font-display">
                {images[activeIndex].caption}
              </p>
            )}
          </div>

          {/* Next */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-11 h-11 rounded-md text-paper hover:text-orange transition-colors"
            aria-label="Next photo"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Counter */}
          <p className="absolute bottom-4 left-0 right-0 text-center text-paper/50 text-xs font-display tracking-[0.1em]" aria-live="polite">
            {activeIndex + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  );
}