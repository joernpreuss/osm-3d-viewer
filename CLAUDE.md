# CLAUDE.md

Guidance for AI coding assistants working in this repository.

## Project layout

- `backend/` — FastAPI app (`app/`) and pytest suite (`tests/`), managed with uv.
- `frontend/` — Vite + TypeScript (no framework), Vitest for unit tests.
- `.github/workflows/` — CI (lint, type-check, test, build) and GitHub Pages deploy.
- `run.sh` / `run.bat` — build the frontend and serve the full app on :8000.

## Workflow rules

- **Tests first.** For any behavior change, write a failing test and commit it
  before the implementation ("red" commit, then "green" commit).
- **Commit style:** short imperative English sentences, sentence case, no
  prefixes. Examples: "Add health endpoint", "Fix import order in tests".
- **Features go through a branch and a pull request.** CI must be green before
  merging. Small fixes and docs may go directly to `main`.
- **Run all checks locally before committing:**
  - Backend: `uv run pytest && uv run ruff check && uv run ruff format --check . && uv run mypy .` (in `backend/`)
  - Frontend: `npm test && npm run build` (in `frontend/`)
- **Keep it minimal.** Prefer small, polished changes over large ones. No new
  dependencies without a clear need. Never commit build artifacts
  (`frontend/dist/`, `.venv/`, `node_modules/`).

## Conventions

- Backend: Python 3.12+, full type hints (`mypy --strict` must pass).
- Frontend: strict TypeScript, keep logic in small testable modules
  (see `src/theme.ts`, `src/health.ts`) separate from DOM wiring (`src/main.ts`).
- API routes live under `/api/`; the frontend calls them on its own origin.
- Code, comments, commits, and docs are written in English.
