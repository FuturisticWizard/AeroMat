import { describe, it, expect } from "vitest";
import { formSchema } from "./schemas";

const valid = {
  firstName: "Jan",
  email: "jan@firma.pl",
  title: "Mural 8m2",
  message: "Chcialbym zamowic mural na klatce schodowej.",
};

describe("formSchema", () => {
  it("accepts a well-formed payload", () => {
    const result = formSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  describe("firstName", () => {
    it("rejects fewer than 2 characters", () => {
      expect(formSchema.safeParse({ ...valid, firstName: "J" }).success).toBe(false);
    });

    it("accepts exactly 2 characters (lower boundary)", () => {
      expect(formSchema.safeParse({ ...valid, firstName: "Jo" }).success).toBe(true);
    });

    it("accepts exactly 50 characters (upper boundary)", () => {
      expect(formSchema.safeParse({ ...valid, firstName: "a".repeat(50) }).success).toBe(true);
    });

    it("rejects more than 50 characters", () => {
      expect(formSchema.safeParse({ ...valid, firstName: "a".repeat(51) }).success).toBe(false);
    });
  });

  describe("email", () => {
    it("rejects a malformed address", () => {
      expect(formSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
    });

    it("rejects an empty address", () => {
      expect(formSchema.safeParse({ ...valid, email: "" }).success).toBe(false);
    });

    it("accepts an address of exactly 250 characters (upper boundary)", () => {
      const localPart = "a".repeat(245); // 245 + "@b.pl" (5) = 250
      expect(formSchema.safeParse({ ...valid, email: `${localPart}@b.pl` }).success).toBe(true);
    });

    it("rejects an address longer than 250 characters", () => {
      const localPart = "a".repeat(246); // 246 + "@b.pl" (5) = 251
      expect(formSchema.safeParse({ ...valid, email: `${localPart}@b.pl` }).success).toBe(false);
    });
  });

  describe("title", () => {
    it("rejects fewer than 2 characters", () => {
      expect(formSchema.safeParse({ ...valid, title: "x" }).success).toBe(false);
    });

    it("rejects more than 250 characters", () => {
      expect(formSchema.safeParse({ ...valid, title: "a".repeat(251) }).success).toBe(false);
    });
  });

  describe("message", () => {
    it("rejects fewer than 2 characters", () => {
      expect(formSchema.safeParse({ ...valid, message: "x" }).success).toBe(false);
    });

    it("accepts exactly 5000 characters (upper boundary)", () => {
      expect(formSchema.safeParse({ ...valid, message: "a".repeat(5000) }).success).toBe(true);
    });

    it("rejects more than 5000 characters", () => {
      expect(formSchema.safeParse({ ...valid, message: "a".repeat(5001) }).success).toBe(false);
    });
  });

  it("rejects payloads with missing fields", () => {
    expect(formSchema.safeParse({ firstName: "Jan" }).success).toBe(false);
  });
});
