import { ExternalLink as ExternalIcon } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  href: string;
  children: ReactNode;
  newTabLabel: string;
  className?: string;
}

/** External link that opens in a new tab safely and tells screen-reader users it does. */
export function ExternalLink({ href, children, newTabLabel, className = "" }: Props) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <ExternalIcon
        aria-hidden="true"
        size={16}
        className="ml-1.5 inline-block shrink-0 align-[-2px]"
      />
      <span className="sr-only"> {newTabLabel}</span>
    </a>
  );
}
