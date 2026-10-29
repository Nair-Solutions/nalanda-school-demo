"use client";

import Link from "next/link";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { pagePath } from "@/content/routes";
import { validateEnquiry, type EnquiryFieldErrors, type EnquiryStatus } from "@/lib/enquiry-schema";
import { buttonClasses } from "@/components/ui/ButtonLink";

interface Props {
  locale: Locale;
  t: Dictionary["form"];
  copy: Pick<
    Dictionary["home"],
    "callbackHeading" | "callbackBody" | "callbackSubmit" | "callbackSuccessTitle"
  >;
}

type State =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; status: EnquiryStatus | "network" };

const field =
  "mt-1.5 block w-full rounded-xl bg-paper px-4 py-3 text-base text-ink ring-1 ring-inset ring-navy-800/15 placeholder:text-muted/70 focus:bg-white focus:ring-2 focus:ring-navy-800 focus:outline-none";

/**
 * The working action on the first screen (impeccable "Persuade": the visitor's
 * action in its working form). Three fields; it posts to the same enquiry API
 * as the full form and shows success only after delivery.
 */
export function CallbackForm({ locale, t, copy }: Props) {
  const [state, setState] = useState<State>({ kind: "idle" });
  const [errors, setErrors] = useState<EnquiryFieldErrors>({});
  const [startedAt] = useState(() => Date.now());
  const statusRef = useRef<HTMLDivElement>(null);
  const id = (name: string) => `callback-${name}`;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.kind === "submitting") return;
    const data = new FormData(event.currentTarget);
    const values = {
      parentName: String(data.get("parentName") ?? ""),
      phone: String(data.get("phone") ?? ""),
      email: "",
      studentName: "",
      studentClass: String(data.get("studentClass") ?? ""),
      topic: "admission",
      message: "Call-back requested from the homepage.",
      consent: data.get("consent") === "on",
      website: String(data.get("website") ?? ""),
    };
    const check = validateEnquiry(values);
    if (!check.ok) {
      setErrors(check.errors);
      const first = (["parentName", "phone", "studentClass", "consent"] as const).find(
        (f) => check.errors[f],
      );
      if (first) document.getElementById(id(first))?.focus();
      return;
    }
    setErrors({});
    setState({ kind: "submitting" });
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, locale, startedAt }),
      });
      const body = (await response.json().catch(() => null)) as {
        ok?: boolean;
        status?: EnquiryStatus;
      } | null;
      setState(
        response.ok && body?.ok
          ? { kind: "success" }
          : { kind: "error", status: body?.status ?? "failed" },
      );
    } catch {
      setState({ kind: "error", status: "network" });
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  const err = (name: keyof EnquiryFieldErrors) =>
    errors[name] ? (
      <p
        id={id(`${name}-error`)}
        className="text-crimson-800 mt-1.5 flex items-center gap-1 text-sm font-semibold"
      >
        <AlertCircle aria-hidden="true" size={15} />
        {t.errors[errors[name]!]}
      </p>
    ) : null;
  const describedBy = (name: keyof EnquiryFieldErrors) =>
    errors[name] ? id(`${name}-error`) : undefined;

  return (
    <section
      aria-labelledby="callback-heading"
      className="rounded-3xl bg-white p-6 sm:p-8"
      data-testid="callback-card"
    >
      <h2 id="callback-heading" className="text-title text-navy-900">
        {copy.callbackHeading}
      </h2>
      {state.kind === "success" ? (
        <div
          ref={statusRef}
          tabIndex={-1}
          role="status"
          className="mt-4 focus:outline-none"
          data-testid="callback-success"
        >
          <p className="text-body flex items-start gap-2 font-semibold text-emerald-800">
            <CheckCircle2 aria-hidden="true" className="mt-1 shrink-0" />
            {copy.callbackSuccessTitle}
          </p>
        </div>
      ) : (
        <>
          <p className="text-ink mt-1.5 text-base">{copy.callbackBody}</p>
          <form
            noValidate
            onSubmit={onSubmit}
            className="mt-5 grid gap-4"
            data-testid="callback-form"
          >
            <div
              ref={statusRef}
              tabIndex={-1}
              aria-live="polite"
              className="empty:hidden focus:outline-none"
            >
              {state.kind === "error" && (
                <p
                  role="alert"
                  className="bg-crimson-50 text-crimson-800 rounded-xl p-3"
                  data-testid="callback-error"
                >
                  {t.status[state.status]}
                </p>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor={id("parentName")} className="text-[15px] font-semibold">
                  {t.parentName}
                </label>
                <input
                  id={id("parentName")}
                  name="parentName"
                  autoComplete="name"
                  maxLength={100}
                  aria-invalid={errors.parentName ? true : undefined}
                  aria-describedby={describedBy("parentName")}
                  className={field}
                />
                {err("parentName")}
              </div>
              <div>
                <label htmlFor={id("phone")} className="text-[15px] font-semibold">
                  {t.phone}
                </label>
                <input
                  id={id("phone")}
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  maxLength={20}
                  placeholder={t.phonePlaceholder}
                  aria-invalid={errors.phone ? true : undefined}
                  aria-describedby={describedBy("phone")}
                  className={field}
                />
                {err("phone")}
              </div>
            </div>
            <div>
              <label htmlFor={id("studentClass")} className="text-[15px] font-semibold">
                {t.studentClass} <span className="text-muted font-normal">({t.optional})</span>
              </label>
              <input
                id={id("studentClass")}
                name="studentClass"
                maxLength={40}
                placeholder={t.studentClassPlaceholder}
                className={field}
              />
            </div>
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor={id("website")}>{t.honeypot}</label>
              <input id={id("website")} name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <div>
              <div className="flex items-start gap-3">
                <input
                  id={id("consent")}
                  name="consent"
                  type="checkbox"
                  aria-invalid={errors.consent ? true : undefined}
                  aria-describedby={describedBy("consent")}
                  className="mt-1 h-5 w-5 shrink-0"
                />
                <label htmlFor={id("consent")} className="text-ink text-sm">
                  {t.consent}{" "}
                  <Link
                    href={pagePath(locale, "privacy")}
                    className="text-navy-800 font-semibold underline"
                  >
                    {t.privacyLink}
                  </Link>
                </label>
              </div>
              {err("consent")}
            </div>
            <button
              type="submit"
              disabled={state.kind === "submitting"}
              className={buttonClasses(
                "primary",
                "w-full disabled:cursor-wait disabled:opacity-75",
              )}
              data-testid="callback-submit"
            >
              {state.kind === "submitting" && (
                <Loader2 aria-hidden="true" size={18} className="animate-spin" />
              )}
              {state.kind === "submitting" ? t.submitting : copy.callbackSubmit}
            </button>
          </form>
        </>
      )}
    </section>
  );
}
