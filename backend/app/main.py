from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

DEFAULT_FRONTEND_DIST = Path(__file__).resolve().parents[2] / "frontend" / "dist"


def create_app(frontend_dist: Path = DEFAULT_FRONTEND_DIST) -> FastAPI:
    app = FastAPI(title="fastapi-vite-template")

    @app.get("/api/health")
    def health() -> dict[str, str]:
        return {"status": "ok"}

    if frontend_dist.is_dir():
        app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend")

    return app


app = create_app()
