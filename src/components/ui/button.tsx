import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "brand" | "sky" | "soft" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-field font-semibold whitespace-nowrap " +
  "transition-all duration-150 active:scale-[0.98] " +
  "disabled:pointer-events-none disabled:opacity-40";

const variants: Record<ButtonVariant, string> = {
  /** The commit action — Save, Apply Changes, View Analytics. */
  brand: "bg-brand-600 text-paper hover:bg-brand-700 shadow-card",
  /** The inviting action — New Module, the one you are meant to press. */
  sky: "bg-sky-300 text-brand-700 hover:bg-sky-400 shadow-card",
  /** Secondary next to a brand button — Modify Module. */
  soft: "bg-surface text-ink hover:bg-surface-strong",
  outline: "border border-line-strong bg-paper text-ink hover:bg-surface",
  ghost: "text-ink-soft hover:bg-surface hover:text-ink",
  danger: "border border-danger-500 text-danger-500 hover:bg-danger-50",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-[0.8125rem]",
  md: "h-11 px-5 text-[0.875rem]",
  lg: "h-13 px-7 text-[0.9375rem]",
};

interface StyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

export function buttonClasses({
  variant = "brand",
  size = "md",
  className,
}: StyleOptions = {}): string {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & StyleOptions;

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, className })}
      {...props}
    />
  );
}

type ButtonLinkProps = StyleOptions & { href: string; children: ReactNode };

export function ButtonLink({
  href,
  variant,
  size,
  className,
  children,
}: ButtonLinkProps) {
  return (
    <Link href={href} className={buttonClasses({ variant, size, className })}>
      {children}
    </Link>
  );
}
