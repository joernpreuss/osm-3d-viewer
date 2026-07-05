# fastapi-vite-template

[![CI](https://github.com/joernpreuss/fastapi-vite-template/actions/workflows/ci.yml/badge.svg)](https://github.com/joernpreuss/fastapi-vite-template/actions/workflows/ci.yml)

A minimal, production-minded full-stack template: **FastAPI** backend, **Vite + TypeScript** frontend, CI/CD via GitHub Actions, test-driven development, and a one-command start on macOS, Linux, and Windows.

## What's inside

- **Backend:** FastAPI, managed with [uv](https://docs.astral.sh/uv/), linted with ruff, type-checked with mypy, tested with pytest.
- **Frontend:** Vite + TypeScript (no framework), tested with Vitest.
- **CI/CD:** GitHub Actions — lint, type-check, test, and build on every push.
- **Workflow:** trunk-based with feature branches and pull requests; tests first.

## Live demo

The frontend is deployed to GitHub Pages on every push to `main`: [joernpreuss.github.io/fastapi-vite-template](https://joernpreuss.github.io/fastapi-vite-template/)

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
