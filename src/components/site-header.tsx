"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Container } from "./container";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Warranty", href: "#warranty" },
  { label: "About", href: "#about" },
  { label: "Reviews", href: "#reviews" },
];

function BrandMark() {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="M.R. Renovations — Home">
      {/* MR badge */}
      <span
        className="inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-md bg-navy text-paper font-display font-bold text-base shrink-0"
        aria-hidden="true"
      >
        MR
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-display font-bold text-navy text-sm sm:text-base tracking-tight">
          M.R. RENOVATIONS, LLC
        </span>
        <span className="font-display font-medium text-orange text-[10px] sm:text-[11px] tracking-[0.16em] uppercase">
          Design &middot; Build &middot; Renovate
        </span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="sticky top-0 z-40 bg-paper border-b border-faint">
        {/* Utility strip */}
        <div className="bg-navy-deep text-paper text-xs">
          <Container width="wide" className="flex items-center justify-between h-9 gap-4">
            <div className="flex items-center gap-3 sm:gap-5 text-soft-navy/90 overflow-hidden">
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="text-orange" aria-hidden="true">&#9679;</span>
                Maple Grove, MN
              </span>
              <span className="hidden sm:inline whitespace-nowrap">Family-owned</span>
              <span className="hidden sm:inline whitespace-nowrap">40 Years</span>
              <Link
                href="#warranty"
                className="hidden md:inline-flex items-center gap-1.5 whitespace-nowrap hover:text-paper transition-colors"
              >
                <span aria-hidden="true">&infin;</span>
                Lifetime Transferable Workmanship Warranty
              </Link>
            </div>
            <a
              href="tel:7639002024"
              className="font-display font-semibold text-paper whitespace-nowrap hover:text-orange transition-colors"
            >
              763-900-2024
            </a>
          </Container>
        </div>

        {/* Main bar */}
        <Container as="nav" width="wide" className="flex items-center justify-between h-16 sm:h-20">
          <BrandMark />

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            <ul className="flex items-center gap-7">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-ink hover:text-navy transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/consultation"
              className="inline-flex items-center justify-center bg-orange hover:bg-orange-deep text-paper font-display font-semibold text-sm px-5 py-2.5 rounded-md transition-colors"
            >
              Free Estimate
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-md text-ink hover:bg-soft-navy transition-colors"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            {open ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="17" x2="21" y2="17" />
              </svg>
            )}
          </button>
        </Container>
      </div>

      {/* Mobile menu panel (sibling of header — sits outside backdrop-filter containing block) */}
      {open ? (
        <div
          id="mobile-menu"
          className="lg:hidden fixed inset-x-0 top-[6.25rem] sm:top-[7.25rem] bottom-0 z-50 bg-paper border-t border-faint overflow-y-auto"
        >
          <Container width="wide" className="py-6">
            <ul className="flex flex-col">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 text-lg font-display font-medium text-ink border-b border-faint hover:text-navy transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/consultation"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center bg-orange hover:bg-orange-deep text-paper font-display font-semibold px-5 py-3 rounded-md transition-colors"
              >
                Free Estimate
              </Link>
              <a
                href="tel:7639002024"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center bg-soft-navy text-navy font-display font-semibold px-5 py-3 rounded-md hover:bg-faint transition-colors"
              >
                Call 763-900-2024
              </a>
            </div>
          </Container>
        </div>
      ) : null}
    </>
  );
}
