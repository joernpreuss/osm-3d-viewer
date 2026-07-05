import { describe, expect, it } from "vitest";

import { isThemeChoice, resolveTheme } from "./theme";

describe("resolveTheme", () => {
  it("returns the explicit choice regardless of system preference", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });

  it("follows the system preference when choice is system", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
  });
});

describe("isThemeChoice", () => {
  it("accepts valid choices", () => {
    expect(isThemeChoice("system")).toBe(true);
    expect(isThemeChoice("light")).toBe(true);
    expect(isThemeChoice("dark")).toBe(true);
  });

  it("rejects anything else, e.g. tampered localStorage values", () => {
    expect(isThemeChoice("blue")).toBe(false);
    expect(isThemeChoice("")).toBe(false);
    expect(isThemeChoice(null)).toBe(false);
    expect(isThemeChoice(undefined)).toBe(false);
  });
});
