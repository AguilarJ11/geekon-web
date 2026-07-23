"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size    = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center font-semibold leading-none select-none " +
  "transition-all duration-200 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet/50 " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-navy " +
  "disabled:pointer-events-none disabled:opacity-50";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-violet text-white rounded-xl " +
    "shadow-[0_2px_14px_rgba(123,47,255,0.35)] " +
    "hover:brightness-110 hover:-translate-y-px " +
    "hover:shadow-[0_6px_26px_rgba(123,47,255,0.55)] active:translate-y-0",
  secondary:
    "border border-white/15 text-content/65 rounded-xl bg-white/[0.02] " +
    "hover:border-white/25 hover:text-content hover:bg-white/[0.05] hover:-translate-y-px",
  ghost:
    "text-content/55 rounded-lg hover:text-content hover:bg-white/5",
};

const SIZES: Record<Size, string> = {
  sm: "px-4 py-2 text-xs gap-1.5",
  md: "px-5 py-2.5 text-sm gap-2",
  lg: "px-7 py-3.5 text-[0.9375rem] gap-2.5",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  href?: string;
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  size    = "md",
  className,
  href,
  children,
  ...rest
}: ButtonProps) {
  const cls = cn(BASE, VARIANTS[variant], SIZES[size], className);

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
