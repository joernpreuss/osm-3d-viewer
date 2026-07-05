# Briefing für Claude Code: Repo "osm-3d-viewer"

## Herkunft und Status

- Erzeugt per "Use this template" aus [joernpreuss/fastapi-vite-template](https://github.com/joernpreuss/fastapi-vite-template) (FastAPI + Vite/TS, CI, Pages-Deploy, run-Scripts, Vitest/pytest-Setup — alles funktioniert).
- Public Repo: https://github.com/joernpreuss/osm-3d-viewer
- GitHub Pages ist aktiviert (build_type=workflow): https://joernpreuss.github.io/osm-3d-viewer/ — Deploy läuft bei jedem Push auf main automatisch.
- Repo-Beschreibung auf GitHub ist gesetzt.
- **Noch offen als erste Aufgabe:** README anpassen — Titel/Badge/Demo-Link zeigen noch auf `fastapi-vite-template`, Intro-Text muss das Projekt beschreiben (3D-Viewer) plus "Built from fastapi-vite-template"-Verweis.

## Was gebaut wird

3D-rotierbare Stadtansicht auf echten OSM-Daten:

- **MapLibre GL JS** als Karten-Engine (npm-Paket, kein React).
- **OpenFreeMap** als Basemap (Style z.B. "liberty") — kostenlos, KEIN API-Key (wichtig: public Repo, alles muss kostenlos bleiben).
- **3D-Gebäude** via `fill-extrusion` direkt aus den Vektortiles (enthalten Gebäude-Layer mit Höhen — kein eigener Datenabruf nötig).
- **Rotation/Neigung** via `pitch`/`bearing`, Startausschnitt: Köln.
- Utility-Logik (z.B. Bearing-Normalisierung, Kamera-Parameter) als kleine testbare Module mit **Vitest, Tests zuerst**.
- Backend bleibt vorerst minimal (`/api/health` existiert). Erweiterungen wie Overpass-Datenabruf NUR als GitHub-Issue anlegen, nicht bauen.
- Theme-Switcher + Backend-Status-Widget aus dem Template können bleiben/integriert werden, wo sinnvoll (z.B. als kleines Overlay-Panel über der Karte).

## Arbeitsweise

- Auf Pages läuft nur das Frontend (statisch) — die Map funktioniert dort voll, der Backend-Status zeigt ehrlich "unreachable". Lokal via `./run.sh` ist alles grün.
