"use client";

import Image from "next/image";
import { Expand, X } from "lucide-react";
import { useRef } from "react";
import { judoPoster } from "@/content/achievements";

interface Props {
  labels: {
    alt: string;
    open: string;
    close: string;
    openOriginal: string;
    dialogLabel: string;
    newTab: string;
  };
  sizes: string;
  priority?: boolean;
  className?: string;
}

/**
 * Shows the achievers poster at a readable size, with a native <dialog>
 * viewer (focus trap, Escape to close) and a link to the original file.
 */
export function PosterViewer({ labels, sizes, priority = false, className = "" }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <figure className={className}>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="group shadow-card relative block w-full overflow-hidden rounded-xl bg-white ring-1 ring-black/5"
        data-testid="poster-open"
      >
        <Image
          src={judoPoster.src}
          alt={labels.alt}
          width={judoPoster.width}
          height={judoPoster.height}
          sizes={sizes}
          priority={priority}
          className="h-auto w-full transition-transform duration-300 group-hover:scale-[1.01]"
        />
        <span className="bg-navy-950/85 absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-white">
          <Expand aria-hidden="true" size={16} />
          {labels.open}
        </span>
      </button>

      <dialog
        ref={dialogRef}
        aria-label={labels.dialogLabel}
        className="backdrop:bg-navy-950/80 m-auto max-h-[96dvh] w-[min(980px,96vw)] rounded-xl bg-white p-0"
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current?.close();
        }}
        data-testid="poster-dialog"
      >
        <div className="border-line sticky top-0 z-10 flex items-center justify-between gap-3 border-b bg-white px-4 py-2">
          <a
            href={judoPoster.src}
            target="_blank"
            rel="noopener noreferrer"
            className="text-navy-800 text-sm font-semibold underline underline-offset-4"
          >
            {labels.openOriginal}
            <span className="sr-only"> {labels.newTab}</span>
          </a>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="text-navy-800 hover:bg-navy-50 inline-flex h-11 items-center gap-1 rounded-lg px-3 text-sm font-semibold"
            autoFocus
          >
            <X aria-hidden="true" size={18} />
            {labels.close}
          </button>
        </div>
        <Image
          src={judoPoster.src}
          alt={labels.alt}
          width={judoPoster.width}
          height={judoPoster.height}
          sizes="(min-width: 1000px) 980px, 96vw"
          className="h-auto w-full"
        />
      </dialog>
    </figure>
  );
}
