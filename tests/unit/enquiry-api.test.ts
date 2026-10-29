import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/enquiry/route";
import { resetRateLimit } from "@/lib/rate-limit";

const body = {
  parentName: "Asha Verma",
  phone: "9876543210",
  email: "asha@example.com",
  studentName: "",
  studentClass: "",
  topic: "admission",
  message: "Hello",
  consent: true,
  website: "",
  locale: "hi",
  startedAt: Date.now() - 10_000,
};

function request(data: unknown, ip = "1.1.1.1") {
  return new NextRequest("http://localhost/api/enquiry", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      host: "localhost",
      origin: "http://localhost",
      "x-forwarded-for": ip,
    },
    body: typeof data === "string" ? data : JSON.stringify(data),
  });
}

describe("POST /api/enquiry", () => {
  beforeEach(() => {
    resetRateLimit();
    vi.unstubAllEnvs();
    for (const key of [
      "RESEND_API_KEY",
      "ENQUIRY_TO_EMAIL",
      "ENQUIRY_FROM_EMAIL",
      "ENQUIRY_WEBHOOK_URL",
      "ENQUIRY_WEBHOOK_SECRET",
    ]) {
      vi.stubEnv(key, "");
    }
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("returns 503 notConfigured (never a fake success) when no provider is set", async () => {
    const res = await POST(request({ ...body, startedAt: Date.now() - 10_000 }));
    expect(res.status).toBe(503);
    expect(await res.json()).toMatchObject({ ok: false, status: "notConfigured" });
  });

  it("returns 422 with field codes for invalid input", async () => {
    const res = await POST(request({ ...body, phone: "123", startedAt: Date.now() - 10_000 }));
    expect(res.status).toBe(422);
    expect(await res.json()).toMatchObject({ status: "invalid", errors: { phone: "phone" } });
  });

  it("rejects submissions faster than a human could fill the form", async () => {
    const res = await POST(request({ ...body, startedAt: Date.now() }));
    expect(res.status).toBe(400);
  });

  it("silently drops honeypot submissions without sending", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("ENQUIRY_WEBHOOK_URL", "https://hooks.example.test/x");
    const res = await POST(request({ ...body, website: "spam", startedAt: Date.now() - 10_000 }));
    expect(res.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects cross-origin posts and malformed JSON", async () => {
    const cross = new NextRequest("http://localhost/api/enquiry", {
      method: "POST",
      headers: { host: "localhost", origin: "https://evil.example" },
      body: JSON.stringify(body),
    });
    expect((await POST(cross)).status).toBe(403);
    expect((await POST(request("{not json"))).status).toBe(400);
  });

  it("sends via Resend with plain text and reply-to when configured", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("ENQUIRY_TO_EMAIL", "office@example.test");
    vi.stubEnv("ENQUIRY_FROM_EMAIL", "Website <web@example.test>");
    const res = await POST(request({ ...body, startedAt: Date.now() - 10_000 }));
    expect(res.status).toBe(200);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe("https://api.resend.com/emails");
    const sent = JSON.parse(init.body);
    expect(sent).toMatchObject({ to: ["office@example.test"], reply_to: "asha@example.com" });
    expect(sent.text).toContain("Mobile: +91 9876543210");
    expect(sent.html).toBeUndefined();
  });

  it("reports failure when the provider errors", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("err", { status: 500 })));
    vi.stubEnv("ENQUIRY_WEBHOOK_URL", "https://hooks.example.test/x");
    const res = await POST(request({ ...body, startedAt: Date.now() - 10_000 }));
    expect(res.status).toBe(502);
    expect(await res.json()).toMatchObject({ status: "failed" });
  });

  it("treats a webhook 2xx without {ok:true} as a failure", async () => {
    vi.stubEnv("ENQUIRY_WEBHOOK_URL", "https://hooks.example.test/x");
    vi.stubEnv("ENQUIRY_WEBHOOK_SECRET", "s3cret");
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response("<html>Error</html>", { status: 200 }))
      .mockResolvedValueOnce(Response.json({ ok: false, message: "forbidden" }))
      .mockResolvedValueOnce(Response.json({ ok: true }));
    vi.stubGlobal("fetch", fetchMock);
    const send = () => POST(request({ ...body, startedAt: Date.now() - 10_000 }));
    expect((await send()).status).toBe(502);
    expect((await send()).status).toBe(502);
    expect((await send()).status).toBe(200);
    const sent = JSON.parse(fetchMock.mock.calls[2]![1].body);
    expect(sent).toMatchObject({ secret: "s3cret", phone: "9876543210", locale: "hi" });
    expect(fetchMock.mock.calls[2]![1].headers["X-Enquiry-Secret"]).toBe("s3cret");
  });

  it("rate-limits repeated submissions from one IP", async () => {
    let last = 0;
    for (let i = 0; i < 6; i++)
      last = (await POST(request({ ...body, startedAt: Date.now() - 10_000 }))).status;
    expect(last).toBe(429);
  });
});
