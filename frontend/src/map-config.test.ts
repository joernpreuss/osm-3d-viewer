import { describe, expect, it } from "vitest";

import {
  COLOGNE_VIEW,
  STYLE_URL,
  buildingExtrusionLayer,
  firstSymbolLayerId,
  firstVectorSourceId,
} from "./map-config";

describe("STYLE_URL", () => {
  it("points to OpenFreeMap over https without an API key", () => {
    expect(STYLE_URL.startsWith("https://")).toBe(true);
    expect(STYLE_URL).toContain("openfreemap");
    expect(STYLE_URL).not.toContain("?");
  });
});

describe("COLOGNE_VIEW", () => {
  it("centers on Cologne", () => {
    const [lng, lat] = COLOGNE_VIEW.center;
    expect(lng).toBeGreaterThan(6.8);
    expect(lng).toBeLessThan(7.1);
    expect(lat).toBeGreaterThan(50.85);
    expect(lat).toBeLessThan(51.0);
  });

  it("starts tilted so the 3D buildings are visible", () => {
    expect(COLOGNE_VIEW.pitch).toBeGreaterThan(30);
    expect(COLOGNE_VIEW.pitch).toBeLessThanOrEqual(85);
  });

  it("starts zoomed in far enough for the building layer", () => {
    expect(COLOGNE_VIEW.zoom).toBeGreaterThanOrEqual(
      buildingExtrusionLayer("openmaptiles").minzoom ?? Infinity,
    );
    expect(COLOGNE_VIEW.zoom).toBeLessThan(18);
  });
});

describe("buildingExtrusionLayer", () => {
  const layer = buildingExtrusionLayer("openmaptiles");

  it("extrudes the building layer of the given vector source", () => {
    expect(layer.type).toBe("fill-extrusion");
    expect(layer.source).toBe("openmaptiles");
    expect(layer["source-layer"]).toBe("building");
  });

  it("takes heights from the OpenMapTiles render attributes", () => {
    expect(JSON.stringify(layer.paint?.["fill-extrusion-height"])).toContain(
      "render_height",
    );
    expect(JSON.stringify(layer.paint?.["fill-extrusion-base"])).toContain(
      "render_min_height",
    );
  });

  it("stays slightly transparent so streets remain visible", () => {
    const opacity = layer.paint?.["fill-extrusion-opacity"];
    expect(opacity).toBeGreaterThan(0);
    expect(opacity).toBeLessThan(1);
  });
});

describe("firstSymbolLayerId", () => {
  it("returns the first symbol layer so buildings slot in below labels", () => {
    expect(
      firstSymbolLayerId([
        { id: "water", type: "fill" },
        { id: "road-label", type: "symbol" },
        { id: "place-label", type: "symbol" },
      ]),
    ).toBe("road-label");
  });

  it("returns undefined when there are no symbol layers", () => {
    expect(firstSymbolLayerId([{ id: "water", type: "fill" }])).toBeUndefined();
    expect(firstSymbolLayerId([])).toBeUndefined();
  });
});

describe("firstVectorSourceId", () => {
  it("finds the vector source regardless of its name", () => {
    expect(
      firstVectorSourceId({
        hillshade: { type: "raster-dem" },
        openmaptiles: { type: "vector" },
      }),
    ).toBe("openmaptiles");
  });

  it("returns undefined when the style has no vector source", () => {
    expect(firstVectorSourceId({ satellite: { type: "raster" } })).toBeUndefined();
    expect(firstVectorSourceId({})).toBeUndefined();
  });
});
