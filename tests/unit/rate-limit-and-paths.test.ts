import { beforeEach, describe, expect, it } from "vitest";
import { rateLimit, resetRateLimit } from "@/lib/rate-limit";
import { switchLocalePath } from "@/i18n/locale-path";
import { format } from "@/i18n/get-dictionary";

describe("rateLimit", () => {
  beforeEach(() => resetRateLimit());

  it("allows up to the limit within the window, then blocks", () => {
    const t = 1_000_000;
    for (let i = 0; i < 5; i++) expect(rateLimit("ip", 5, 60_000, t + i)).toBe(true);
    expect(rateLimit("ip", 5, 60_000, t + 10)).toBe(false);
    expect(rateLimit("other", 5, 60_000, t + 10)).toBe(true);
  });

  it("allows again after the window passes", () => {
    for (let i = 0; i < 5; i++) rateLimit("ip", 5, 1000, i);
    expect(rateLimit("ip", 5, 1000, 2000)).toBe(true);
  });
});

describe("switchLocalePath", () => {
  it.each([
    ["/en", "hi", "/hi"],
    ["/en/book-list", "hi", "/hi/book-list"],
    ["/hi/contact", "en", "/en/contact"],
    ["/", "hi", "/hi"],
    ["/contact", "en", "/en/contact"],
  ] as const)("%s -> %s", (path, target, expected) => {
    expect(switchLocalePath(path, target)).toBe(expected);
  });
});

describe("format", () => {
  it("replaces known placeholders and keeps unknown ones", () => {
    expect(format("Class {cls} {x}", { cls: "8 A" })).toBe("Class 8 A {x}");
  });
});
