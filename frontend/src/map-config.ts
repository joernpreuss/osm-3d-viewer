import type { FillExtrusionLayerSpecification } from "maplibre-gl";

/** OpenFreeMap style — free to use, no API key. */
export const STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";

export interface MapView {
  center: [number, number];
  zoom: number;
  pitch: number;
  bearing: number;
}

/** Initial view: Cologne cathedral and old town, tilted for the 3D effect. */
export const COLOGNE_VIEW: MapView = {
  center: [6.9581, 50.9413],
  zoom: 15.5,
  pitch: 60,
  bearing: -20,
};

/**
 * 3D buildings extruded straight from the OpenMapTiles `building` layer,
 * which carries render heights — no separate data fetch needed.
 */
export function buildingExtrusionLayer(
  sourceId: string,
): FillExtrusionLayerSpecification {
  return {
    id: "3d-buildings",
    type: "fill-extrusion",
    source: sourceId,
    "source-layer": "building",
    minzoom: 14,
    paint: {
      "fill-extrusion-color": [
        "interpolate",
        ["linear"],
        ["coalesce", ["get", "render_height"], 0],
        0,
        "#e3ded4",
        80,
        "#b3aca0",
      ],
      "fill-extrusion-height": ["coalesce", ["get", "render_height"], 0],
      "fill-extrusion-base": ["coalesce", ["get", "render_min_height"], 0],
      "fill-extrusion-opacity": 0.85,
    },
  };
}

/** Id of the first symbol layer, so buildings can slot in below all labels. */
export function firstSymbolLayerId(
  layers: readonly { id: string; type: string }[],
): string | undefined {
  return layers.find((layer) => layer.type === "symbol")?.id;
}

/** Id of the style's vector tile source, whatever the style names it. */
export function firstVectorSourceId(
  sources: Record<string, { type: string }>,
): string | undefined {
  return Object.entries(sources).find(
    ([, source]) => source.type === "vector",
  )?.[0];
}
