import { describe, expect, it } from "vitest";

import { interpretHealthResponse } from "./health";

describe("interpretHealthResponse", () => {
  it("reports healthy for a 2xx response with status ok", () => {
    expect(interpretHealthResponse(true, { status: "ok" })).toBe("healthy");
  });

  it("reports unreachable for a 2xx response with unexpected body", () => {
    expect(interpretHealthResponse(true, { status: "error" })).toBe(
      "unreachable",
    );
    expect(interpretHealthResponse(true, "ok")).toBe("unreachable");
    expect(interpretHealthResponse(true, null)).toBe("unreachable");
  });

  it("reports unreachable for a failed response", () => {
    expect(interpretHealthResponse(false, { status: "ok" })).toBe(
      "unreachable",
    );
  });
});
