# osm-3d-viewer

[![CI](https://github.com/joernpreuss/osm-3d-viewer/actions/workflows/ci.yml/badge.svg)](https://github.com/joernpreuss/osm-3d-viewer/actions/workflows/ci.yml)

A 3D city viewer on real OpenStreetMap data: rotate and tilt around extruded
buildings rendered with [MapLibre GL JS](https://maplibre.org/) on the free
[OpenFreeMap](https://openfreemap.org/) vector tiles — no API key required.
The initial view shows Cologne.

Built from [fastapi-vite-template](https://github.com/joernpreuss/fastapi-vite-template):
**FastAPI** backend, **Vite + TypeScript** frontend, CI/CD via GitHub Actions,
test-driven development, and a one-command start on macOS, Linux, and Windows.

## What's inside

- **Map:** MapLibre GL JS with OpenFreeMap basemap, 3D buildings via
  `fill-extrusion` straight from the vector tiles, rotation and tilt via
  `bearing`/`pitch`.
- **Backend:** FastAPI, managed with [uv](https://docs.astral.sh/uv/), linted with ruff, type-checked with mypy, tested with pytest.
- **Frontend:** Vite + TypeScript (no framework), tested with Vitest.
- **CI/CD:** GitHub Actions — lint, type-check, test, and build on every push.
- **Workflow:** trunk-based with feature branches and pull requests; tests first.

## Live demo

The frontend is deployed to GitHub Pages on every push to `main`: [joernpreuss.github.io/osm-3d-viewer](https://joernpreuss.github.io/osm-3d-viewer/)

The Pages deployment is frontend-only, so the backend status widget honestly
reports "unreachable" there; the map itself is fully functional.

## Getting started

Prerequisites: [uv](https://docs.astral.sh/uv/) and [Node.js](https://nodejs.org/) 22+ — both install without admin rights.

One command builds the frontend and serves the app at <http://localhost:8000>:

```sh
./run.sh        # macOS / Linux
run.bat         # Windows
```

### Development mode

Run backend and frontend separately for hot reload:

```sh
cd backend && uv run uvicorn app.main:app --reload   # API on :8000
cd frontend && npm run dev                           # UI on :5173, proxies /api
```

### Tests and checks

```sh
cd backend && uv run pytest && uv run ruff check && uv run mypy .
cd frontend && npm test && npm run build
```

Both suites run in CI on every push and pull request.

## License

[MIT](LICENSE)
