import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("joins truthy class values", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("drops falsy / conditional values", () => {
    expect(cn("a", false && "b", undefined, null, "c")).toBe("a c");
  });

  it("lets a later Tailwind class win on conflict", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-sm", "text-lg")).toBe("text-lg");
  });

  it("keeps non-conflicting Tailwind classes", () => {
    expect(cn("px-2", "py-4")).toBe("px-2 py-4");
  });
});
