"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

export interface DropdownItem {
  href: string;
  label: string;
  current: boolean;
}

interface Props {
  label: string;
  overviewHref: string;
  overviewLabel: string;
  items: DropdownItem[];
  active: boolean;
}

/**
 * Disclosure-style dropdown (button + list of links), the recommended pattern
 * for site navigation. Opens on click/Enter/Space/ArrowDown; closes on Escape,
 * outside click, or when focus leaves. No hover-open, so mouse, touch and
 * keyboard all behave the same way.
 */
export function RulesDropdown({ label, overviewHref, overviewLabel, items, active }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  const links = () =>
    Array.from(rootRef.current?.querySelectorAll<HTMLAnchorElement>("[data-dropdown-link]") ?? []);

  const close = useCallback((returnFocus = false) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close();
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open, close]);

  const onButtonKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => links()[0]?.focus());
    }
  };

  const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const all = links();
    const index = all.indexOf(document.activeElement as HTMLAnchorElement);
    if (event.key === "Escape") {
      event.preventDefault();
      close(true);
    } else if (event.key === "ArrowDown" && index >= 0) {
      event.preventDefault();
      all[(index + 1) % all.length]?.focus();
    } else if (event.key === "ArrowUp" && index >= 0) {
      event.preventDefault();
      all[(index - 1 + all.length) % all.length]?.focus();
    } else if (event.key === "Home" && index >= 0) {
      event.preventDefault();
      all[0]?.focus();
    } else if (event.key === "End" && index >= 0) {
      event.preventDefault();
      all[all.length - 1]?.focus();
    }
  };

  return (
    <div
      ref={rootRef}
      className="relative"
      onKeyDown={onMenuKeyDown}
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onButtonKeyDown}
        className={`flex h-12 items-center gap-1 px-3 text-[15px] font-semibold transition-colors hover:bg-white/10 hover:text-white ${
          active ? "text-gold-400" : "text-white/90"
        }`}
      >
        {label}
        <ChevronDown
          aria-hidden="true"
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        id={menuId}
        hidden={!open}
        className="border-line absolute top-full left-0 z-50 w-72 rounded-b-xl border border-t-0 bg-white p-2 shadow-[var(--shadow-float)]"
      >
        <ul>
          <li>
            <Link
              data-dropdown-link
              href={overviewHref}
              onClick={() => close()}
              className="text-navy-800 hover:bg-navy-50 block rounded-md px-3 py-2 text-sm font-semibold"
            >
              {overviewLabel}
            </Link>
          </li>
          {items.map((item) => (
            <li key={item.href}>
              <Link
                data-dropdown-link
                href={item.href}
                aria-current={item.current ? "page" : undefined}
                onClick={() => close()}
                className={`hover:bg-navy-50 block rounded-md px-3 py-2 text-[15px] ${
                  item.current ? "bg-navy-50 text-crimson-800 font-semibold" : "text-ink"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
