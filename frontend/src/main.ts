import "maplibre-gl/dist/maplibre-gl.css";
import "./style.css";

import { Map as MapLibreMap, NavigationControl } from "maplibre-gl";

import { MAX_PITCH, normalizeBearing } from "./camera";
import { interpretHealthResponse, type BackendStatus } from "./health";
import {
  COLOGNE_VIEW,
  STYLE_URL,
  buildingExtrusionLayer,
  firstSymbolLayerId,
  firstVectorSourceId,
} from "./map-config";
import {
  THEME_CHOICES,
  isThemeChoice,
  resolveTheme,
  type ThemeChoice,
} from "./theme";

const THEME_STORAGE_KEY = "theme";

function storedThemeChoice(): ThemeChoice {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return isThemeChoice(stored) ? stored : "system";
}

function applyTheme(choice: ThemeChoice): void {
  const prefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;
  document.documentElement.dataset.theme = resolveTheme(choice, prefersDark);
}

async function fetchBackendStatus(): Promise<BackendStatus> {
  try {
    const response = await fetch("/api/health");
    return interpretHealthResponse(response.ok, await response.json());
  } catch {
    return "unreachable";
  }
}

function initMap(container: HTMLElement, readout: HTMLElement | null): void {
  // macOS opens the context menu on mousedown (and treats Ctrl+click as a
  // right click), which swallows the rotate drag before it starts.
  container.addEventListener("contextmenu", (e) => e.preventDefault());

  let map: MapLibreMap;
  try {
    map = new MapLibreMap({
      container,
      style: STYLE_URL,
      center: COLOGNE_VIEW.center,
      zoom: COLOGNE_VIEW.zoom,
      pitch: COLOGNE_VIEW.pitch,
      bearing: COLOGNE_VIEW.bearing,
      maxPitch: MAX_PITCH,
    });
  } catch (error) {
    container.innerHTML = `
      <p class="map-error">
        Could not start the 3D map — this viewer needs WebGL2.<br />
        Enable graphics acceleration in your browser settings and reload.
      </p>
    `;
    console.error(error);
    return;
  }

  map.addControl(new NavigationControl({ visualizePitch: true }), "top-right");

  map.on("load", () => {
    const style = map.getStyle();
    // Own the 3D buildings: replace any extrusion layers the style ships.
    for (const layer of style.layers) {
      if (layer.type === "fill-extrusion") {
        map.removeLayer(layer.id);
      }
    }
    const sourceId = firstVectorSourceId(style.sources);
    if (sourceId) {
      map.addLayer(
        buildingExtrusionLayer(sourceId),
        firstSymbolLayerId(style.layers),
      );
    }
  });

  const updateReadout = (): void => {
    if (readout) {
      const bearing = Math.round(normalizeBearing(map.getBearing()));
      const pitch = Math.round(map.getPitch());
      readout.textContent = `bearing ${bearing}° · pitch ${pitch}°`;
    }
  };
  map.on("move", updateReadout);
  updateReadout();
}

function render(app: HTMLElement): void {
  const choice = storedThemeChoice();

  app.innerHTML = `
    <div id="map" aria-label="Rotatable 3D map of Cologne"></div>
    <aside class="panel">
      <header class="panel-header">
        <h1>osm-3d-viewer</h1>
        <span id="camera-readout" class="camera-readout"></span>
      </header>
      <p class="hint">Drag to pan. Right-drag or Ctrl+drag to rotate and tilt.</p>
      <footer class="panel-footer">
        <span class="status">
          Backend
          <span id="status-dot" class="status-dot"></span>
          <span id="status-label">checking…</span>
        </span>
        <label class="theme">
          Theme
          <select id="theme-select">
            ${THEME_CHOICES.map(
              (c) =>
                `<option value="${c}"${c === choice ? " selected" : ""}>${c}</option>`,
            ).join("")}
          </select>
        </label>
      </footer>
    </aside>
  `;

  const select = app.querySelector<HTMLSelectElement>("#theme-select");
  select?.addEventListener("change", () => {
    const value = select.value;
    if (isThemeChoice(value)) {
      localStorage.setItem(THEME_STORAGE_KEY, value);
      applyTheme(value);
    }
  });

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => applyTheme(storedThemeChoice()));

  void fetchBackendStatus().then((status) => {
    const dot = app.querySelector<HTMLSpanElement>("#status-dot");
    const label = app.querySelector<HTMLSpanElement>("#status-label");
    dot?.classList.add(status);
    if (label) {
      label.textContent = status;
    }
  });

  const mapContainer = app.querySelector<HTMLDivElement>("#map");
  if (mapContainer) {
    initMap(
      mapContainer,
      app.querySelector<HTMLSpanElement>("#camera-readout"),
    );
  }
}

applyTheme(storedThemeChoice());

const app = document.querySelector<HTMLDivElement>("#app");
if (app) {
  render(app);
}
