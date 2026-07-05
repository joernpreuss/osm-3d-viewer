from pathlib import Path

from fastapi.testclient import TestClient

from app.main import create_app


def make_dist(tmp_path: Path) -> Path:
    dist = tmp_path / "dist"
    dist.mkdir()
    (dist / "index.html").write_text(
        "<!doctype html><title>frontend build</title>", encoding="utf-8"
    )
    return dist


def test_serves_frontend_index(tmp_path: Path) -> None:
    client = TestClient(create_app(frontend_dist=make_dist(tmp_path)))
    response = client.get("/")
    assert response.status_code == 200
    assert "frontend build" in response.text


def test_api_still_available_alongside_frontend(tmp_path: Path) -> None:
    client = TestClient(create_app(frontend_dist=make_dist(tmp_path)))
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_works_without_frontend_build(tmp_path: Path) -> None:
    client = TestClient(create_app(frontend_dist=tmp_path / "missing"))
    assert client.get("/").status_code == 404
    assert client.get("/api/health").status_code == 200
