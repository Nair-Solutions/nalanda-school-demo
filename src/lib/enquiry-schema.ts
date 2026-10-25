import { z } from "zod";

// Zod would otherwise probe `new Function()` for JIT support, which our CSP (no unsafe-eval) blocks.
z.config({ jitless: true });

/** Error codes map to dictionary.form.errors so messages are translated on the client. */
export type FieldErrorCode = "required" | "tooLong" | "tooShort" | "phone" | "email" | "consent";

export const enquiryTopics = ["admission", "academics", "documents", "other"] as const;
export type EnquiryTopic = (typeof enquiryTopics)[number];

const trimmed = (max: number) =>
  z.string({ error: "required" }).trim().max(max, { error: "tooLong" });

/** Accepts 10-digit Indian mobile numbers with optional +91 / 0 prefix and spaces or dashes. */
export function normalizeIndianMobile(raw: string): string | null {
  const digits = raw.replace(/[\s-]/g, "").replace(/^(\+91|0091|91(?=\d{10}$)|0(?=\d{10}$))/, "");
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

export const enquirySchema = z.object({
  parentName: trimmed(100).min(1, { error: "required" }).min(2, { error: "tooShort" }),
  phone: trimmed(20)
    .min(1, { error: "required" })
    .refine((v) => normalizeIndianMobile(v) !== null, { error: "phone" }),
  email: trimmed(254).pipe(z.union([z.literal(""), z.email({ error: "email" })])),
  studentName: trimmed(100),
  studentClass: trimmed(40),
  topic: z.enum(enquiryTopics, { error: "required" }),
  message: trimmed(1000),
  consent: z.literal(true, { error: "consent" }),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export type EnquiryFieldErrors = Partial<Record<keyof EnquiryInput, FieldErrorCode>>;

const knownCodes = new Set<FieldErrorCode>([
  "required",
  "tooLong",
  "tooShort",
  "phone",
  "email",
  "consent",
]);

/** Validate and return either the parsed data or a per-field error code map. */
export function validateEnquiry(
  input: unknown,
): { ok: true; data: EnquiryInput } | { ok: false; errors: EnquiryFieldErrors } {
  const result = enquirySchema.safeParse(input);
  if (result.success) return { ok: true, data: result.data };
  const errors: EnquiryFieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof EnquiryInput | undefined;
    if (!field || errors[field]) continue;
    errors[field] = knownCodes.has(issue.message as FieldErrorCode)
      ? (issue.message as FieldErrorCode)
      : "required";
  }
  return { ok: false, errors };
}

/** Status codes the API returns; the form maps them to dictionary.form.status. */
export type EnquiryStatus = "notConfigured" | "rateLimited" | "tooFast" | "invalid" | "failed";

/** Minimum time a human takes to fill the form; faster submissions are treated as bots. */
export const MIN_FILL_MS = 3000;
