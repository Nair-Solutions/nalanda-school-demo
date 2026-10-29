import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "onDark" | "outlineOnDark";

const variants: Record<Variant, string> = {
  primary: "bg-crimson-800 text-white hover:bg-crimson-700",
  secondary: "bg-white text-navy-800 ring-2 ring-inset ring-navy-800 hover:bg-navy-50",
  onDark: "bg-gold-400 text-navy-950 hover:bg-gold-100",
  outlineOnDark: "text-white ring-2 ring-inset ring-white/70 hover:bg-white/10",
};

/** Every action is a pill (DESIGN.md → Buttons). */
export function buttonClasses(variant: Variant = "primary", extra = ""): string {
  return `inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-2.5 text-base font-semibold transition-[background-color,transform] duration-150 active:scale-[0.98] ${variants[variant]} ${extra}`;
}

type Props = ComponentProps<typeof Link> & { variant?: Variant };

export function ButtonLink({ variant = "primary", className = "", ...props }: Props) {
  return <Link className={buttonClasses(variant, className)} {...props} />;
}
