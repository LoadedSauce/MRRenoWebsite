"use client";

import { useState } from "react";

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
  /** "light" for paper/cream sections, "dark" for navy sections */
  tone?: "light" | "dark";
}

/**
 * Accessible FAQ accordion â€” exclusive-open (one item open at a time).
 *
 * WAI-ARIA pattern: button[aria-expanded] + region[aria-labelledby].
 * Keyboard: Tab/Shift+Tab between triggers; Space/Enter to toggle.
 * Minimal chrome â€” divider lines only, no card box shadows.
 * Data shape is compatible with future schema.org/FAQPage JSON-LD wiring.
 */
export function FaqAccordion({ items, tone = "light" }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const isDark = tone === "dark";

  const triggerClass = isDark
    ? "text-paper hover:text-orange"
    : "text-ink hover:text-navy";

  const answerClass = isDark ? "text-on-navy-muted" : "text-muted";

  const dividerBorder = isDark ? "border-paper/15" : "border-faint";

  const toggle = (index: number) =>
    setOpenIndex((prev) => (prev === index ? null : index));

  return (
    <dl className={`divide-y ${dividerBorder}`}>
      {items.map((item, i) => {
        const isOpen    = openIndex === i;
        const answerId  = `faq-answer-${i}`;
        const triggerId = `faq-trigger-${i}`;

        return (
          <div key={i}>
            <dt>
              <button
                id={triggerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={answerId}
                onClick={() => toggle(i)}
                className={`w-full flex items-center justify-between gap-4 py-5 text-left font-display font-semibold text-base transition-colors focus-visible:outline-none focus-visible:text-orange ${triggerClass}`}
              >
                <span>{item.question}</span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className={`shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </dt>
            <dd
              id={answerId}
              role="region"
              aria-labelledby={triggerId}
              hidden={!isOpen}
              className={`pb-5 text-sm leading-relaxed ${answerClass}`}
            >
              {item.answer}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}