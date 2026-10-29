import { describe, expect, it } from "vitest";
import { normalizeIndianMobile, validateEnquiry } from "@/lib/enquiry-schema";

const valid = {
  parentName: "Asha Verma",
  phone: "98765 43210",
  email: "",
  studentName: "",
  studentClass: "Class 6",
  topic: "admission",
  message: "Is admission open?",
  consent: true,
};

describe("normalizeIndianMobile", () => {
  it.each([
    ["9876543210", "9876543210"],
    ["+91 98765 43210", "9876543210"],
    ["+91-98765-43210", "9876543210"],
    ["09876543210", "9876543210"],
    ["919876543210", "9876543210"],
  ])("accepts %s", (input, expected) => {
    expect(normalizeIndianMobile(input)).toBe(expected);
  });

  it.each(["12345", "5876543210", "98765432101", "abcdefghij", ""])("rejects %s", (input) => {
    expect(normalizeIndianMobile(input)).toBeNull();
  });
});

describe("validateEnquiry", () => {
  it("accepts a complete valid enquiry", () => {
    expect(validateEnquiry(valid).ok).toBe(true);
  });

  it("reports required fields and consent", () => {
    const result = validateEnquiry({ ...valid, parentName: "", phone: "", consent: false });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toMatchObject({
        parentName: "required",
        phone: "required",
        consent: "consent",
      });
    }
  });

  it("reports invalid phone and email", () => {
    const result = validateEnquiry({ ...valid, phone: "12345", email: "not-an-email" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors).toMatchObject({ phone: "phone", email: "email" });
  });

  it("rejects over-long messages and unknown topics", () => {
    const result = validateEnquiry({ ...valid, message: "x".repeat(1001), topic: "hack" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors).toMatchObject({ message: "tooLong", topic: "required" });
  });

  it("trims whitespace", () => {
    const result = validateEnquiry({ ...valid, parentName: "  Asha  " });
    expect(result.ok && result.data.parentName).toBe("Asha");
  });
});
