import "server-only";
import { normalizeIndianMobile, type EnquiryInput } from "./enquiry-schema";

export type DeliveryResult = "sent" | "notConfigured" | "failed";

const topicLabels: Record<EnquiryInput["topic"], string> = {
  admission: "Admission",
  academics: "Academics",
  documents: "Documents and disclosures",
  other: "Something else",
};

/** Plain-text body: no HTML, so nothing the visitor typed can inject markup. */
export function formatEnquiryText(data: EnquiryInput, locale: string, receivedAt: Date): string {
  const lines = [
    "New enquiry from the school website",
    "",
    `Topic: ${topicLabels[data.topic]}`,
    `Parent / guardian: ${data.parentName}`,
    `Mobile: +91 ${normalizeIndianMobile(data.phone) ?? data.phone}`,
    `Email: ${data.email || "(not given)"}`,
    `Student: ${data.studentName || "(not given)"}`,
    `Class of interest: ${data.studentClass || "(not given)"}`,
    `Website language: ${locale === "hi" ? "Hindi" : "English"}`,
    `Received: ${receivedAt.toISOString()}`,
    "",
    "Message:",
    data.message || "(no message)",
  ];
  return lines.join("\n");
}

/**
 * Send the enquiry using whichever provider is configured. Returns
 * "notConfigured" when no provider is set up, so the UI never shows a
 * false success.
 */
export async function deliverEnquiry(data: EnquiryInput, locale: string): Promise<DeliveryResult> {
  const receivedAt = new Date();
  const text = formatEnquiryText(data, locale, receivedAt);

  const {
    RESEND_API_KEY,
    ENQUIRY_TO_EMAIL,
    ENQUIRY_FROM_EMAIL,
    ENQUIRY_WEBHOOK_URL,
    ENQUIRY_WEBHOOK_SECRET,
  } = process.env;

  if (RESEND_API_KEY && ENQUIRY_TO_EMAIL && ENQUIRY_FROM_EMAIL) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: ENQUIRY_FROM_EMAIL,
        to: ENQUIRY_TO_EMAIL.split(",").map((s) => s.trim()),
        subject: `Website enquiry: ${topicLabels[data.topic]} – ${data.parentName}`.slice(0, 150),
        text,
        ...(data.email ? { reply_to: data.email } : {}),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    return response.ok ? "sent" : "failed";
  }

  if (ENQUIRY_WEBHOOK_URL) {
    const response = await fetch(ENQUIRY_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(ENQUIRY_WEBHOOK_SECRET ? { "X-Enquiry-Secret": ENQUIRY_WEBHOOK_SECRET } : {}),
      },
      body: JSON.stringify({
        ...data,
        phone: normalizeIndianMobile(data.phone) ?? data.phone,
        locale,
        receivedAt: receivedAt.toISOString(),
        // Apps Script web apps cannot read request headers, so the secret is also sent in the body.
        ...(ENQUIRY_WEBHOOK_SECRET ? { secret: ENQUIRY_WEBHOOK_SECRET } : {}),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    return response.ok ? "sent" : "failed";
  }

  return "notConfigured";
}
