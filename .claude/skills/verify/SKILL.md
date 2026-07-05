---
name: verify
description: Build, launch, and drive this app end-to-end to verify a change works.
---

# Verifying osm-3d-viewer changes

## Build and launch

```sh
cd frontend && npm ci && npm run build
cd backend && uv run uvicorn app.main:app --host 127.0.0.1 --port 8000
```

The backend serves `frontend/dist/` at `/` and the API at `/api/health`
(returns `{"status": "ok"}`).

## Drive the UI

Use Playwright (headless Chromium) against `http://127.0.0.1:8000/`.
In sandboxes that block `tiles.openfreemap.org`, stub the style request with
`page.route("https://tiles.openfreemap.org/styles/liberty", ...)` returning a
minimal style (version 8, one `vector` source, a `background`, a
`fill-extrusion`, and a `symbol` layer) so the map's `load` event fires and
the app's 3D-buildings code path runs; fulfill tile requests with 204.

Flows worth driving:

- Panel renders: `.panel h1`, `.hint`, `#status-label` flips from "checking…"
  to `healthy` (backend up) or `unreachable`.
- Camera readout `#camera-readout` shows "bearing 340° · pitch 60°" initially
  (bearing -20 normalized).
- Ctrl+drag on the canvas rotates/tilts — the readout must change and pitch
  must clamp at 85°.
- Theme select flips `document.documentElement.dataset.theme`.
- Without the style stub the style fetch fails but the panel must keep
  working (this mirrors offline use).
- A `contextmenu` event dispatched on the map canvas must end up
  `defaultPrevented` (macOS opens the menu on mousedown, killing rotate drags).
- Launched with `--disable-webgl --disable-webgl2`, the app must show the
  `.map-error` message instead of a blank map, panel still working.

Gotchas: launch Chromium with `--enable-unsafe-swiftshader` for WebGL in
headless mode; the browser binary lives at `/opt/pw-browsers/chromium` in
Claude's remote containers.
