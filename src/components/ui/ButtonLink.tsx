import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "onDark" | "outlineOnDark";

const variants: Record<Variant, string> = {
  primary: "bg-crimson-800 text-white hover:bg-crimson-700 shadow-sm",
  secondary:
    "border border-navy-800/25 bg-white text-navy-800 hover:border-navy-800 hover:bg-navy-50",
  onDark: "bg-gold-400 text-navy-950 hover:bg-gold-100",
  outlineOnDark: "border border-white/40 text-white hover:bg-white/10",
};

export function buttonClasses(variant: Variant = "primary", extra = ""): string {
  return `inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-[15px] font-semibold transition-colors ${variants[variant]} ${extra}`;
}

type Props = ComponentProps<typeof Link> & { variant?: Variant };

export function ButtonLink({ variant = "primary", className = "", ...props }: Props) {
  return <Link className={buttonClasses(variant, className)} {...props} />;
}
