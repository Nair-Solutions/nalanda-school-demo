"use client";

import Image from "next/image";
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useCallback, useMemo, useRef, useState, type PointerEvent } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { galleryCategoryLabels, type GalleryCategory, type GalleryItem } from "@/content/gallery";

interface Props {
  items: GalleryItem[];
  locale: Locale;
  t: Dictionary["viewer"];
  newTabLabel: string;
}

function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (m0, k: string) => (k in values ? String(values[k]) : m0));
}

/**
 * Apple-style photo tiles with category filters, and a full-screen viewer:
 * arrow keys, swipe, Escape, counter and the original file. Motion animates
 * the change between photos; reduced motion turns it into an instant swap.
 */
export function GalleryViewer({ items, locale, t, newTabLabel }: Props) {
  const categories = useMemo(
    () => Array.from(new Set(items.map((item) => item.category))),
    [items],
  );
  const [filter, setFilter] = useState<GalleryCategory | "all">("all");
  const visible = filter === "all" ? items : items.filter((item) => item.category === filter);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const swipeStart = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();
  const current = visible[index];

  const openAt = (i: number) => {
    setIndex(i);
    setDirection(0);
    dialogRef.current?.showModal();
  };
  const step = useCallback(
    (delta: number) => {
      if (visible.length < 2) return;
      setDirection(delta);
      setIndex((i) => (i + delta + visible.length) % visible.length);
    },
    [visible.length],
  );

  const onPointerUp = (event: PointerEvent) => {
    if (swipeStart.current === null) return;
    const dx = event.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  };

  const travel = reduceMotion ? 0 : 60;

  return (
    <LazyMotion features={domAnimation}>
      {categories.length > 1 && (
        <div
          role="group"
          aria-label={t.filterLabel}
          className="mb-6 flex flex-wrap gap-2"
          data-testid="gallery-filters"
        >
          {(["all", ...categories] as const).map((category) => (
            <button
              key={category}
              type="button"
              aria-pressed={filter === category}
              onClick={() => {
                setFilter(category);
                setIndex(0);
              }}
              className={`min-h-11 rounded-full px-5 font-semibold transition-colors ${
                filter === category
                  ? "bg-navy-800 text-white"
                  : "text-navy-800 hover:bg-navy-50 bg-white"
              }`}
            >
              {category === "all" ? t.filterAll : galleryCategoryLabels[category][locale]}
            </button>
          ))}
        </div>
      )}

      <ul className="grid grid-cols-2 gap-2 md:grid-cols-3" data-testid="gallery-grid">
        {visible.map((item, i) => (
          <li key={item.id} className={i === 0 ? "col-span-2 row-span-2" : ""}>
            <button
              type="button"
              onClick={() => openAt(i)}
              aria-label={fill(t.openPhoto, { title: item.title[locale] })}
              className="group relative block h-full w-full overflow-hidden rounded-[4px] bg-white"
              data-testid="gallery-tile"
            >
              <Image
                src={item.src}
                alt={item.alt[locale]}
                width={item.width}
                height={item.height}
                sizes={i === 0 ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 50vw"}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <span className="bg-navy-950/85 absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-white">
                <Expand aria-hidden="true" size={16} />
                {item.title[locale]}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label={t.label}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") step(1);
          if (event.key === "ArrowLeft") step(-1);
        }}
        className="bg-navy-950 backdrop:bg-navy-950 m-0 h-dvh max-h-none w-screen max-w-none p-0 text-white"
        data-testid="gallery-dialog"
      >
        {current && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <p className="text-sm text-white/80" aria-live="polite">
                {fill(t.counter, { i: index + 1, n: visible.length })}
              </p>
              <div className="flex items-center gap-2">
                <a
                  href={current.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden text-sm font-semibold text-white underline sm:inline"
                >
                  {t.openOriginal}
                  <span className="sr-only"> {newTabLabel}</span>
                </a>
                <button
                  type="button"
                  onClick={() => dialogRef.current?.close()}
                  className="inline-flex h-11 items-center gap-1 rounded-full px-4 font-semibold text-white hover:bg-white/10"
                  autoFocus
                >
                  <X aria-hidden="true" size={18} />
                  {t.close}
                </button>
              </div>
            </div>
            <div
              className="relative flex flex-1 touch-pan-y items-center justify-center overflow-hidden px-2"
              onPointerDown={(event) => (swipeStart.current = event.clientX)}
              onPointerUp={onPointerUp}
            >
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <m.div
                  key={current.id}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * travel }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -direction * travel }}
                  transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="relative h-full w-full"
                >
                  <Image
                    src={current.src}
                    alt={current.alt[locale]}
                    fill
                    sizes="100vw"
                    className="object-contain"
                  />
                </m.div>
              </AnimatePresence>
              {visible.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label={t.previous}
                    className="absolute left-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                  >
                    <ChevronLeft aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label={t.next}
                    className="absolute right-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                  >
                    <ChevronRight aria-hidden="true" />
                  </button>
                </>
              )}
            </div>
            {(current.caption || current.credit) && (
              <p className="px-4 py-4 text-center text-sm text-white/85">
                {current.caption?.[locale]}
                {current.credit &&
                  ` · ${fill(t.credit, { credit: `${current.credit.text}, ${current.credit.licence}` })}`}
              </p>
            )}
          </div>
        )}
      </dialog>
    </LazyMotion>
  );
}
