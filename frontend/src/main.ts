import "./style.css";

import { interpretHealthResponse, type BackendStatus } from "./health";
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

function render(app: HTMLElement): void {
  const choice = storedThemeChoice();

  app.innerHTML = `
    <main class="window">
      <header class="window-header">
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
      </header>
      <div class="window-body">
        <h1>fastapi-vite-template</h1>
        <p>FastAPI backend · Vite + TypeScript frontend</p>
      </div>
    </main>
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
}

applyTheme(storedThemeChoice());

const app = document.querySelector<HTMLDivElement>("#app");
if (app) {
  render(app);
}
