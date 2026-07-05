import { describe, expect, it } from "vitest";

import { MAX_PITCH, clampPitch, normalizeBearing } from "./camera";

describe("normalizeBearing", () => {
  it("keeps bearings already in [0, 360)", () => {
    expect(normalizeBearing(0)).toBe(0);
    expect(normalizeBearing(90)).toBe(90);
    expect(normalizeBearing(359.5)).toBe(359.5);
  });

  it("wraps bearings of a full turn and more", () => {
    expect(normalizeBearing(360)).toBe(0);
    expect(normalizeBearing(450)).toBe(90);
    expect(normalizeBearing(720)).toBe(0);
  });

  it("wraps negative bearings, e.g. MapLibre's (-180, 180] range", () => {
    expect(normalizeBearing(-90)).toBe(270);
    expect(normalizeBearing(-180)).toBe(180);
    expect(normalizeBearing(-540)).toBe(180);
  });

  it("never returns negative zero", () => {
    expect(Object.is(normalizeBearing(-360), 0)).toBe(true);
  });
});

describe("clampPitch", () => {
  it("keeps pitches within the valid range", () => {
    expect(clampPitch(0)).toBe(0);
    expect(clampPitch(45)).toBe(45);
    expect(clampPitch(MAX_PITCH)).toBe(MAX_PITCH);
  });

  it("clamps pitches outside the valid range", () => {
    expect(clampPitch(-10)).toBe(0);
    expect(clampPitch(90)).toBe(MAX_PITCH);
  });
});
