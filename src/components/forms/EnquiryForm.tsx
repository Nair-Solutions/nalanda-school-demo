"use client";

import Link from "next/link";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { pagePath } from "@/content/routes";
import {
  validateEnquiry,
  type EnquiryFieldErrors,
  type EnquiryInput,
  type EnquiryStatus,
  type EnquiryTopic,
} from "@/lib/enquiry-schema";
import { buttonClasses } from "@/components/ui/ButtonLink";

type FormState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; status: EnquiryStatus | "network" };

interface Props {
  locale: Locale;
  t: Dictionary["form"];
  defaultTopic?: EnquiryTopic;
  idPrefix?: string;
}

const inputBase =
  "mt-1.5 block w-full rounded-lg border bg-white px-3.5 py-2.5 text-base text-ink placeholder:text-muted/70 focus:border-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-800/20";

export function EnquiryForm({
  locale,
  t,
  defaultTopic = "admission",
  idPrefix = "enquiry",
}: Props) {
  const [state, setState] = useState<FormState>({ kind: "idle" });
  const [errors, setErrors] = useState<EnquiryFieldErrors>({});
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const id = (name: string) => `${idPrefix}-${name}`;

  const collect = (form: HTMLFormElement) => {
    const data = new FormData(form);
    const text = (name: string) => String(data.get(name) ?? "");
    return {
      parentName: text("parentName"),
      phone: text("phone"),
      email: text("email"),
      studentName: text("studentName"),
      studentClass: text("studentClass"),
      topic: text("topic"),
      message: text("message"),
      consent: data.get("consent") === "on",
      website: text("website"),
    };
  };

  const focusFirstError = (fieldErrors: EnquiryFieldErrors) => {
    const order: (keyof EnquiryInput)[] = [
      "parentName",
      "phone",
      "email",
      "studentName",
      "studentClass",
      "topic",
      "message",
      "consent",
    ];
    const first = order.find((field) => fieldErrors[field]);
    if (first) document.getElementById(id(first))?.focus();
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.kind === "submitting") return;
    const values = collect(event.currentTarget);
    const check = validateEnquiry(values);
    if (!check.ok) {
      setErrors(check.errors);
      setState({ kind: "idle" });
      focusFirstError(check.errors);
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
        ok: boolean;
        status?: EnquiryStatus;
        errors?: EnquiryFieldErrors;
      } | null;
      if (response.ok && body?.ok) {
        setState({ kind: "success" });
        formRef.current?.reset();
      } else {
        if (body?.errors) {
          setErrors(body.errors);
          focusFirstError(body.errors);
        }
        setState({ kind: "error", status: body?.status ?? "failed" });
      }
    } catch {
      setState({ kind: "error", status: "network" });
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  if (state.kind === "success") {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="rounded-xl border border-emerald-700/20 bg-emerald-50 p-6"
        data-testid="enquiry-success"
      >
        <CheckCircle2 aria-hidden="true" className="text-emerald-700" size={28} />
        <p className="mt-3 text-lg font-semibold text-emerald-900">{t.successTitle}</p>
        <p className="mt-1 text-emerald-900/80">{t.successBody}</p>
        <button
          type="button"
          className={buttonClasses("secondary", "mt-5")}
          onClick={() => {
            setStartedAt(Date.now());
            setState({ kind: "idle" });
          }}
        >
          {t.sendAnother}
        </button>
      </div>
    );
  }

  const errorText = (field: keyof EnquiryInput) => {
    const code = errors[field];
    return code ? t.errors[code] : null;
  };

  const describedBy = (field: keyof EnquiryInput, hint?: boolean) =>
    [hint ? id(`${field}-hint`) : null, errors[field] ? id(`${field}-error`) : null]
      .filter(Boolean)
      .join(" ") || undefined;

  const fieldClass = (field: keyof EnquiryInput) =>
    `${inputBase} ${errors[field] ? "border-crimson-700" : "border-line"}`;

  const fieldError = (field: keyof EnquiryInput) =>
    errorText(field) ? (
      <p
        id={id(`${field}-error`)}
        className="text-crimson-800 mt-1.5 flex items-center gap-1 text-sm font-medium"
      >
        <AlertCircle aria-hidden="true" size={15} />
        {errorText(field)}
      </p>
    ) : null;

  const optional = <span className="text-muted font-normal"> ({t.optional})</span>;
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      className="grid gap-5"
      data-testid="enquiry-form"
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
            className="border-crimson-700/30 bg-crimson-50 text-crimson-800 rounded-lg border p-4"
            data-testid="enquiry-error"
          >
            {t.status[state.status]}
          </p>
        )}
        {state.kind !== "error" && hasErrors && (
          <p
            role="alert"
            className="border-crimson-700/30 bg-crimson-50 text-crimson-800 rounded-lg border p-4"
          >
            {t.errorSummary}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={id("parentName")} className="text-[15px] font-semibold">
            {t.parentName}
          </label>
          <input
            id={id("parentName")}
            name="parentName"
            autoComplete="name"
            required
            maxLength={100}
            placeholder={t.parentNamePlaceholder}
            aria-invalid={errors.parentName ? true : undefined}
            aria-describedby={describedBy("parentName")}
            className={fieldClass("parentName")}
          />
          {fieldError("parentName")}
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
            required
            maxLength={20}
            placeholder={t.phonePlaceholder}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={describedBy("phone", true)}
            className={fieldClass("phone")}
          />
          <p id={id("phone-hint")} className="text-muted mt-1 text-sm">
            {t.phoneHint}
          </p>
          {fieldError("phone")}
        </div>
        <div>
          <label htmlFor={id("email")} className="text-[15px] font-semibold">
            {t.email}
            {optional}
          </label>
          <input
            id={id("email")}
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            placeholder={t.emailPlaceholder}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy("email")}
            className={fieldClass("email")}
          />
          {fieldError("email")}
        </div>
        <div>
          <label htmlFor={id("topic")} className="text-[15px] font-semibold">
            {t.topic}
          </label>
          <select
            id={id("topic")}
            name="topic"
            defaultValue={defaultTopic}
            aria-invalid={errors.topic ? true : undefined}
            aria-describedby={describedBy("topic")}
            className={fieldClass("topic")}
          >
            <option value="admission">{t.topicAdmission}</option>
            <option value="academics">{t.topicAcademics}</option>
            <option value="documents">{t.topicDocuments}</option>
            <option value="other">{t.topicOther}</option>
          </select>
          {fieldError("topic")}
        </div>
        <div>
          <label htmlFor={id("studentName")} className="text-[15px] font-semibold">
            {t.studentName}
            {optional}
          </label>
          <input
            id={id("studentName")}
            name="studentName"
            maxLength={100}
            aria-invalid={errors.studentName ? true : undefined}
            aria-describedby={describedBy("studentName")}
            className={fieldClass("studentName")}
          />
          {fieldError("studentName")}
        </div>
        <div>
          <label htmlFor={id("studentClass")} className="text-[15px] font-semibold">
            {t.studentClass}
            {optional}
          </label>
          <input
            id={id("studentClass")}
            name="studentClass"
            maxLength={40}
            placeholder={t.studentClassPlaceholder}
            aria-invalid={errors.studentClass ? true : undefined}
            aria-describedby={describedBy("studentClass")}
            className={fieldClass("studentClass")}
          />
          {fieldError("studentClass")}
        </div>
      </div>

      <div>
        <label htmlFor={id("message")} className="text-[15px] font-semibold">
          {t.message}
          {optional}
        </label>
        <textarea
          id={id("message")}
          name="message"
          rows={4}
          maxLength={1000}
          placeholder={t.messagePlaceholder}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={describedBy("message")}
          className={fieldClass("message")}
        />
        {fieldError("message")}
      </div>

      {/* Honeypot: hidden from people and assistive tech, often filled in by bots. */}
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
            required
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={describedBy("consent")}
            className="accent-navy-800 mt-1 h-5 w-5 shrink-0"
          />
          <label htmlFor={id("consent")} className="text-ink text-[15px]">
            {t.consent}{" "}
            <Link
              href={pagePath(locale, "privacy")}
              className="text-navy-800 font-semibold underline underline-offset-2"
            >
              {t.privacyLink}
            </Link>
          </label>
        </div>
        {fieldError("consent")}
      </div>

      <div>
        <button
          type="submit"
          disabled={state.kind === "submitting"}
          className={buttonClasses(
            "primary",
            "w-full disabled:cursor-wait disabled:opacity-75 sm:w-auto",
          )}
          data-testid="enquiry-submit"
        >
          {state.kind === "submitting" && (
            <Loader2 aria-hidden="true" size={18} className="animate-spin" />
          )}
          {state.kind === "submitting" ? t.submitting : t.submit}
        </button>
      </div>
    </form>
  );
}
