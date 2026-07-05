#!/usr/bin/env sh
# Build the frontend and serve the full app on http://localhost:8000
set -e
cd "$(dirname "$0")"

if ! command -v uv >/dev/null 2>&1; then
    echo "uv is required. Install it with:"
    echo "  curl -LsSf https://astral.sh/uv/install.sh | sh"
    exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
    echo "Node.js (with npm) is required: https://nodejs.org"
    exit 1
fi

echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

echo "Starting app on http://localhost:8000"
if command -v open >/dev/null 2>&1; then
    (sleep 2 && open http://localhost:8000) &
elif command -v xdg-open >/dev/null 2>&1; then
    (sleep 2 && xdg-open http://localhost:8000) &
fi

cd backend
uv run uvicorn app.main:app --port 8000
