import { type ReactNode } from "react";

type ContainerWidth = "narrow" | "default" | "wide";

interface ContainerProps {
  children: ReactNode;
  width?: ContainerWidth;
  className?: string;
  as?: "div" | "section" | "article" | "header" | "footer" | "main" | "nav";
}

const widthClass: Record<ContainerWidth, string> = {
  narrow: "max-w-2xl",
  default: "max-w-6xl",
  wide: "max-w-7xl",
};

export function Container({
  children,
  width = "default",
  className = "",
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag className={`${widthClass[width]} mx-auto px-6 sm:px-8 ${className}`}>
      {children}
    </Tag>
  );
}
