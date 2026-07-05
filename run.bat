@echo off
rem Build the frontend and serve the full app on http://localhost:8000
setlocal
cd /d "%~dp0"

where uv >nul 2>nul
if errorlevel 1 (
    echo uv is required. Install it with:
    echo   powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
    exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
    echo Node.js with npm is required: https://nodejs.org
    exit /b 1
)

echo Building frontend...
cd frontend
call npm install
if errorlevel 1 exit /b 1
call npm run build
if errorlevel 1 exit /b 1
cd ..

echo Starting app on http://localhost:8000
start "" http://localhost:8000

cd backend
uv run uvicorn app.main:app --port 8000
