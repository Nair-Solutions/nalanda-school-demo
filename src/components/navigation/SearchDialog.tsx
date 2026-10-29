"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, Search, X } from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";
import { OPEN_SEARCH_EVENT, searchEntries, type SearchEntry } from "@/lib/search";

interface Props {
  index: SearchEntry[];
  t: Dictionary["search"];
}

function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => (k in values ? String(values[k]) : m));
}

/**
 * Site search over pages and published documents. Opened by any element that
 * dispatches OPEN_SEARCH_EVENT (header button, mobile bar) or Ctrl/⌘+K.
 */
export function SearchDialog({ index, t }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchEntries(index, query), [index, query]);
  const listId = useId();

  const open = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);
  const close = useCallback(() => dialogRef.current?.close(), []);

  useEffect(() => {
    const onOpen = () => open();
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        open();
      }
    };
    window.addEventListener(OPEN_SEARCH_EVENT, onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(OPEN_SEARCH_EVENT, onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const go = (entry: SearchEntry) => {
    close();
    if (entry.kind === "document") window.open(entry.href, "_blank", "noopener");
    else router.push(entry.href);
  };

  return (
    <dialog
      ref={dialogRef}
      aria-label={t.dialogLabel}
      onClose={() => setQuery("")}
      onClick={(event) => {
        if (event.target === dialogRef.current) close();
      }}
      className="text-ink backdrop:bg-navy-950/70 mx-auto mt-[10dvh] w-[min(40rem,calc(100vw-2rem))] rounded-2xl bg-white p-0 shadow-[var(--shadow-float)]"
      data-testid="search-dialog"
    >
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          if (results[0]) go(results[0]);
        }}
        className="border-line flex items-center gap-3 border-b px-4"
      >
        <Search aria-hidden="true" size={20} className="text-muted shrink-0" />
        <label htmlFor={`${listId}-input`} className="sr-only">
          {t.inputLabel}
        </label>
        <input
          ref={inputRef}
          id={`${listId}-input`}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            // A search field's first Escape would only clear the text; close the dialog instead.
            if (event.key === "Escape") {
              event.preventDefault();
              close();
            }
          }}
          placeholder={t.placeholder}
          autoComplete="off"
          aria-controls={listId}
          className="placeholder:text-muted/80 min-h-14 w-full bg-transparent text-lg outline-none"
          data-testid="search-input"
        />
        <button
          type="button"
          onClick={close}
          className="text-navy-800 hover:bg-navy-50 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
          aria-label={t.close}
        >
          <X aria-hidden="true" size={20} />
        </button>
      </form>
      <div className="max-h-[60dvh] overflow-y-auto p-2">
        <p aria-live="polite" className="sr-only">
          {query.trim() ? fill(t.resultCount, { n: results.length }) : ""}
        </p>
        {query.trim() && results.length === 0 && (
          <p className="text-body text-ink p-4" data-testid="search-empty">
            {fill(t.noResults, { q: query.trim() })}
          </p>
        )}
        <ul id={listId}>
          {results.map((entry) => (
            <li key={entry.href}>
              <Link
                href={entry.href}
                onClick={(event) => {
                  event.preventDefault();
                  go(entry);
                }}
                className="hover:bg-navy-50 focus-visible:bg-navy-50 flex items-start gap-3 rounded-xl p-3"
              >
                {entry.kind === "document" ? (
                  <FileText
                    aria-hidden="true"
                    size={20}
                    className="text-crimson-800 mt-1 shrink-0"
                  />
                ) : (
                  <Search aria-hidden="true" size={20} className="text-muted mt-1 shrink-0" />
                )}
                <span>
                  <span className="text-navy-900 block font-semibold">{entry.title}</span>
                  <span className="text-muted mt-0.5 line-clamp-2 block text-sm">
                    {entry.kind === "document" ? `${t.kindDocument} · ` : ""}
                    {entry.description}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </dialog>
  );
}

/** Any button that opens search. */
export function openSearch() {
  window.dispatchEvent(new Event(OPEN_SEARCH_EVENT));
}
