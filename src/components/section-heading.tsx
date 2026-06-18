import { type ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
}: SectionHeadingProps) {
  const isDark = tone === "dark";
  const alignClass = align === "center" ? "text-center mx-auto" : "";

  return (
    <div className={`max-w-2xl ${alignClass}`}>
      {eyebrow ? (
        <p
          className={`font-display font-semibold tracking-[0.12em] uppercase text-xs mb-3 ${
            isDark ? "text-orange" : "text-orange"
          }`}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`font-display font-bold text-3xl sm:text-4xl tracking-tight ${
          isDark ? "text-paper" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`mt-4 text-base sm:text-lg leading-relaxed ${
            isDark ? "text-soft-navy" : "text-muted"
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
